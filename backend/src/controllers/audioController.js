import Audio from '../models/Audio.js';

// @desc    Obtener todos los audios
// @route   GET /api/audios
// @access  Public (con restricciones)
export const getAudios = async (req, res) => {
    try {
        const audios = await Audio.find({}).populate('categoria', 'nombre slug');

        const response = audios.map((item) => {
            const itemObj = item.toObject();

            // Si el usuario NO está autenticado, ocultar urlPrivada
            if (!req.user) {
                delete itemObj.urlPrivada;
            }

            return itemObj;
        });

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener un audio por ID
// @route   GET /api/audios/:id
// @access  Public (con restricciones)
export const getAudioById = async (req, res) => {
    try {
        const audio = await Audio.findById(req.params.id).populate('categoria', 'nombre slug');

        if (audio) {
            const itemObj = audio.toObject();
            if (!req.user) {
                delete itemObj.urlPrivada;
            }
            res.json(itemObj);
        } else {
            res.status(404).json({ message: 'Audio no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Crear un audio
// @route   POST /api/audios
// @access  Private/Admin
export const createAudio = async (req, res) => {
    const { titulo, descripcion, thumbnailUrl, categoria, urlPublica, urlPrivada, esPremium, duracion } = req.body;

    try {
        const audio = new Audio({
            titulo,
            descripcion,
            thumbnailUrl,
            categoria,
            urlPublica,
            urlPrivada,
            esPremium,
            duracion,
        });

        const createdAudio = await audio.save();
        res.status(201).json(createdAudio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Actualizar un audio
// @route   PUT /api/audios/:id
// @access  Private/Admin
export const updateAudio = async (req, res) => {
    const { titulo, descripcion, thumbnailUrl, categoria, urlPublica, urlPrivada, esPremium, duracion } = req.body;

    try {
        const audio = await Audio.findById(req.params.id);

        if (audio) {
            audio.titulo = titulo || audio.titulo;
            audio.descripcion = descripcion || audio.descripcion;
            audio.thumbnailUrl = thumbnailUrl || audio.thumbnailUrl;
            audio.categoria = categoria || audio.categoria;
            audio.urlPublica = urlPublica || audio.urlPublica;
            audio.urlPrivada = urlPrivada || audio.urlPrivada;
            audio.esPremium = esPremium !== undefined ? esPremium : audio.esPremium;
            audio.duracion = duracion || audio.duracion;

            const updatedAudio = await audio.save();
            res.json(updatedAudio);
        } else {
            res.status(404).json({ message: 'Audio no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Eliminar un audio
// @route   DELETE /api/audios/:id
// @access  Private/Admin
export const deleteAudio = async (req, res) => {
    try {
        const audio = await Audio.findById(req.params.id);

        if (audio) {
            await audio.deleteOne();
            res.json({ message: 'Audio eliminado' });
        } else {
            res.status(404).json({ message: 'Audio no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default audioController;