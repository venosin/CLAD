import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    monto: {
        type: Number,
        required: true,
    },
    moneda: {
        type: String,
        required: true,
        default: 'USD',
    },
    transactionId: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
        default: 'completed', // pendiente, completado, fallido
    },
}, {
    timestamps: true,
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;