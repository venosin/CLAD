import Media from '../models/Media.js';

// @desc    Obtener todo el contenido multimedia
// @route   GET /api/media
// @access  Public (con restricciones)
export const getMedia = async (req, res) => {
    try {
        const media = await Media.find({});

        const response = media.map((item) => {
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

// @desc    Crear contenido multimedia
// @route   POST /api/media
// @access  Private/Admin
export const createMedia = async (req, res) => {
    const { titulo, tipo, thumbnailUrl, categoria, urlPublica, urlPrivada, esPremium } = req.body;

    try {
        const media = new Media({
            titulo,
            tipo,
            thumbnailUrl,
            categoria,
            urlPublica,
            urlPrivada,
            esPremium,
        });

        const createdMedia = await media.save();
        res.status(201).json(createdMedia);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Actualizar contenido multimedia
// @route   PUT /api/media/:id
// @access  Private/Admin
export const updateMedia = async (req, res) => {
    const { titulo, tipo, thumbnailUrl, categoria, urlPublica, urlPrivada, esPremium } = req.body;

    try {
        const media = await Media.findById(req.params.id);

        if (media) {
            media.titulo = titulo || media.titulo;
            media.tipo = tipo || media.tipo;
            media.thumbnailUrl = thumbnailUrl || media.thumbnailUrl;
            media.categoria = categoria || media.categoria;
            media.urlPublica = urlPublica || media.urlPublica;
            media.urlPrivada = urlPrivada || media.urlPrivada;
            media.esPremium = esPremium !== undefined ? esPremium : media.esPremium;

            const updatedMedia = await media.save();
            res.json(updatedMedia);
        } else {
            res.status(404).json({ message: 'Contenido no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Eliminar contenido multimedia
// @route   DELETE /api/media/:id
// @access  Private/Admin
export const deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);

        if (media) {
            await media.deleteOne();
            res.json({ message: 'Contenido eliminado' });
        } else {
            res.status(404).json({ message: 'Contenido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
