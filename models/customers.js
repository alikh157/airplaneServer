import mongoose from "mongoose";
import JoiError from "../Exceptions/validationError";

const customerSchema = new mongoose.Schema({
    customerEnglishName: {
        type: String,
        required: true,
    },

    customerEnglishFamilyName: {
        type: String,
        required: true,
    },

    customerPersianName: {
        type: String,
        required: true,
    },

    customerPersianFamilyName: {
        type: String,
        required: true,
    },

    customerAge: {
        type: String,
        required: true,
    },

    customerEmail: {
        type: String,
        trim: true,
        required: true
    },

    customerNationalCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    customerAccountId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: "accounts"
    },

    customerCanceled: {
        type: Boolean,
        required: true,
        default: false
    },
    customerBuyAt: {
        type: Date,
        default: Date.now()
    }
})
customerSchema.post('save', (error, doc, next) => {
    (error.code === 11000) ? next(new JoiError("UniqueCustomerError", "Your nationalCode is repetitive", 40, 400, {
        "pointer": "/admin/takeTicket",
        "parameter": "req.data"
    })) : next()
})
module.exports = mongoose.model('customers', customerSchema);