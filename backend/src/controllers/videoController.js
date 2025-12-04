import Video from '../models/Video.js';

// @desc    Obtener todos los videos
// @route   GET /api/videos
// @access  Public (con restricciones)
export const getVideos = async (req, res) => {
    try {
        const videos = await Video.find({}).populate('categoria', 'nombre slug');

        const response = videos.map((item) => {
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

// @desc    Obtener un video por ID
// @route   GET /api/videos/:id
// @access  Public (con restricciones)
export const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('categoria', 'nombre slug');

        if (video) {
            const itemObj = video.toObject();
            if (!req.user) {
                delete itemObj.urlPrivada;
            }
            res.json(itemObj);
        } else {
            res.status(404).json({ message: 'Video no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Crear un video
// @route   POST /api/videos
// @access  Private/Admin
export const createVideo = async (req, res) => {
    const { titulo, descripcion, thumbnailUrl, categoria, urlPublica, urlPrivada, esPremium, duracion } = req.body;

    try {
        const video = new Video({
            titulo,
            descripcion,
            thumbnailUrl,
            categoria,
            urlPublica,
            urlPrivada,
            esPremium,
            duracion,
        });

        const createdVideo = await video.save();
        res.status(201).json(createdVideo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Actualizar un video
// @route   PUT /api/videos/:id
// @access  Private/Admin
export const updateVideo = async (req, res) => {
    const { titulo, descripcion, thumbnailUrl, categoria, urlPublica, urlPrivada, esPremium, duracion } = req.body;

    try {
        const video = await Video.findById(req.params.id);

        if (video) {
            video.titulo = titulo || video.titulo;
            video.descripcion = descripcion || video.descripcion;
            video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;
            video.categoria = categoria || video.categoria;
            video.urlPublica = urlPublica || video.urlPublica;
            video.urlPrivada = urlPrivada || video.urlPrivada;
            video.esPremium = esPremium !== undefined ? esPremium : video.esPremium;
            video.duracion = duracion || video.duracion;

            const updatedVideo = await video.save();
            res.json(updatedVideo);
        } else {
            res.status(404).json({ message: 'Video no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Eliminar un video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (video) {
            await video.deleteOne();
            res.json({ message: 'Video eliminado' });
        } else {
            res.status(404).json({ message: 'Video no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default videoController;
