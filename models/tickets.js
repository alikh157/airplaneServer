import mongoose from "mongoose";
import JoiError from "../Exceptions/validationError";

const ticketSchema = new mongoose.Schema({
    ticketName: {
        type: String,
        required: true,
    },
    ticketDst: {
        type: String,
        required: true,
        trim: true
    },
    ticketSrc: {
        type: String,
        required: true,
        trim: true
    },
    ticketPNR: {
        type: String,
        required: true,
        trim: true,
        maxlength: 6
    },
    ticketPrice: {
        type: String,
        required: true,
        trim: true
    },
    ticketInternalOrExternal: {
        type: String,
        required: true,
        trim: true,
        enum: ['Internal', 'External']
    },
    ticketBusinessOrEconomy: {
        type: String,
        required: true,
        trim: true
    },
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    ticketAirplaneId: {
        type: mongoose.Types.ObjectId,
        ref: 'airplanes',
        required: true,
    },
    ticketIsCanceled: {
        type: Boolean,
        required: true,
        default: false
    },
    ticketCanceledBy: {
        type: mongoose.Types.ObjectId,
        ref: 'customers'
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