import Progress from '../models/Progress.js';

// @desc    Actualizar o crear progreso de visualización
// @route   POST /api/progress
// @access  Private
export const updateProgress = async (req, res) => {
    const { mediaId, segundoActual, completado } = req.body;

    try {
        // Buscar si ya existe un registro de progreso para este usuario y video
        let progress = await Progress.findOne({
            usuario: req.user._id,
            media: mediaId,
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
                media: mediaId,
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

// @desc    Obtener progreso de un video específico
// @route   GET /api/progress/:mediaId
// @access  Private
export const getProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({
            usuario: req.user._id,
            media: req.params.mediaId,
        });

        if (progress) {
            res.json(progress);
        } else {
            // Si no hay progreso, devolvemos un objeto vacío o valores por defecto
            // Esto evita errores en el frontend si es la primera vez que lo ve
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
            .populate('media', 'titulo thumbnailUrl') // Traemos datos básicos del video
            .sort({ ultimoAcceso: -1 }); // Los más recientes primero

        res.json(progressList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
