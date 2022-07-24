import mongoose from "mongoose";
import JoiError from "../Exceptions/validationError";

const airplaneSchema = new mongoose.Schema({
    airplaneAirlineName: {
        type: String,
        required: true
    },
    airplaneTripId: {
        type: [mongoose.Types.ObjectId],
        // required: true,
        ref:'trips'
    },
    airplaneModel: {
        type: String,
        required: true,
        trim: true
    },
    airplaneImageSrc: {
        type: String,
        required: true,
        trim: true
    },
    airplaneCapacity: {
        type: Number,
        required: true,
        trim: true
    },
    airplaneFlightNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    airplaneCreateAt: {
        type: Date,
        default: Date.now()
    }
},{versionKey: false});
airplaneSchema.post('save', (error, doc, next) => {
    (error.code === 11000) ? next(new JoiError("UniqueAirplaneError", "Your airplane number or airplane airline name is repetitive", 40, 400, {
        "pointer": "/airPlane/makeAirplane",
        "parameter": "req.data"
    })) : next()
})

module.exports = mongoose.model('airplanes', airplaneSchema);