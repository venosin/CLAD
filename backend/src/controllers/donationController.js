import Donation from '../models/Donation.js';

// @desc    Crear una donación
// @route   POST /api/donations
// @access  Private
export const createDonation = async (req, res) => {
    const { monto, moneda, transactionId, estado } = req.body;

    try {
        const donation = new Donation({
            usuario: req.user._id,
            monto,
            moneda,
            transactionId,
            estado,
        });

        const createdDonation = await donation.save();
        res.status(201).json(createdDonation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Obtener donaciones del usuario logueado
// @route   GET /api/donations/my
// @access  Private
export const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ usuario: req.user._id });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener todas las donaciones
// @route   GET /api/donations
// @access  Private/Admin
export const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find({}).populate('usuario', 'id nombre email');
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
