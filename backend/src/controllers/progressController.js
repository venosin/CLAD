import Progress from '../models/Progress.js';

// @desc    Actualizar o crear progreso de visualización/escucha
// @route   POST /api/progress
// @access  Private
export const updateProgress = async (req, res) => {
    const { contenidoId, tipoContenido, segundoActual, completado } = req.body;

    // Validar tipo de contenido
    if (!['Video', 'Audio'].includes(tipoContenido)) {
        return res.status(400).json({ message: 'Tipo de contenido inválido' });
    }

    try {
        // Buscar si ya existe un registro de progreso para este usuario y contenido
        let progress = await Progress.findOne({
            usuario: req.user._id,
            contenido: contenidoId,
            tipoContenido: tipoContenido,
        });

        if (progress) {
            // Si existe, actualizamos
            progress.segundoActual = segundoActual;
            progress.completado = completado;
            progress.ultimoAcceso = Date.now();

            const updatedProgress = await progress.save();
            res.json(updatedProgress);
        } else {
            // Si no existe, creamos uno nuevo
            progress = new Progress({
                usuario: req.user._id,
                contenido: contenidoId,
                tipoContenido: tipoContenido,
                segundoActual,
                completado,
            });

            const createdProgress = await progress.save();
            res.status(201).json(createdProgress);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Obtener progreso de un contenido específico
// @route   GET /api/progress/:id?tipo=Video
// @access  Private
export const getProgress = async (req, res) => {
    const contenidoId = req.params.id;
    const tipoContenido = req.query.tipo; // 'Video' o 'Audio'

    if (!tipoContenido) {
        return res.status(400).json({ message: 'Debes especificar el tipo de contenido (?tipo=Video o ?tipo=Audio)' });
    }

    try {
        const progress = await Progress.findOne({
            usuario: req.user._id,
            contenido: contenidoId,
            tipoContenido: tipoContenido,
        });

        if (progress) {
            res.json(progress);
        } else {
            res.json({ segundoActual: 0, completado: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener todo el historial de progreso del usuario
// @route   GET /api/progress
// @access  Private
export const getAllUserProgress = async (req, res) => {
    try {
        const progressList = await Progress.find({ usuario: req.user._id })
            .populate('contenido', 'titulo thumbnailUrl') // Mongoose usará refPath para saber si buscar en Video o Audio
            .sort({ ultimoAcceso: -1 });

        res.json(progressList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default progressController;
