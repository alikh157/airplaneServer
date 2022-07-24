import mongoose from "mongoose";
import JoiError from "../Exceptions/validationError";

const tripSchema = new mongoose.Schema({
    tripName: {
        type: String,
        required: true,
    },
    tripDst: {
        type: String,
        required: true,
        trim: true
    },
    tripSrc: {
        type: String,
        required: true,
        trim: true
    },
    tripPrice: {
        type: Number,
        required: true,
    },
    tripTakeOffTime: {
        type: String,
        required: true,
    },
    tripLandingTime: {
        type: String,
        required: true,
    },
    tripDate: {
        type: String,
        required: true,
    },
    tripInternalOrExternal: {
        type: String,
        required: true,
        trim: true,
        enum: ['Internal', 'External']
    },
    tripBusinessOrEconomy: {
        type: String,
        required: true,
        enum: ['Business', 'Economy'],
        trim: true
    },
    tripAirplaneId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    tripIsCanceled: {
        type: Boolean,
        required: true,
        default: false
    },
    tripCreateAt: {
        type: Date,
        default: Date.now()
    }
}, {versionKey: false})
tripSchema.post('save', (error, doc, next) => {
    (error.code === 11000) ? next(new JoiError("UniqueTripError", "Your trip name is repetitive", 40, 400, {
        "pointer": "/trip/makeTrip",
        "parameter": "req.data"
    })) : next()
})

module.exports = mongoose.model('trips', tripSchema);