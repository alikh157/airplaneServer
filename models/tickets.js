import mongoose from "mongoose";
import JoiError from "../Exceptions/validationError";

const ticketSchema = new mongoose.Schema({
    ticketPNR: {
        type: String,
        required: true,
        trim: true,
        maxlength: 6
    },
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    ticketTripId: {
        type: mongoose.Types.ObjectId,
        ref: 'trips',
        required: true,
    },
    ticketIsCanceled: {
        type: Boolean,
        required: true,
        default: false
    },
    ticketTakenBy: {
        type: mongoose.Types.ObjectId,
        ref: 'customers'
    },
    ticketCreateAt: {
        type: Date,
        default: Date.now()
    }
},{versionKey: false})
ticketSchema.post('save', (error, doc, next) => {
    (error.code === 11000) ? next(new JoiError("UniqueTicketError", "Your ticket name is repetitive", 40, 400, {
        "pointer": "/ticket/makeTicket",
        "parameter": "req.data"
    })) : next()
})

module.exports = mongoose.model('tickets', ticketSchema);