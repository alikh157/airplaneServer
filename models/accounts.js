import mongoose from "mongoose";
import JoiError from "../Exceptions/validationError";

const accountSchema = new mongoose.Schema({
    accountEmail:{
        type:String,
        trim:true,
        required:true
    },
    accountPhoneNumber:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    accountPlainPassword:{
        type:String,
        required:true,
        minlength:8
    },
    accountHashedPassword:{
        type:String,
        required:true,
    },
    accountTicketId:{
        type:mongoose.Types.ObjectId,
        ref:"tickets"
    },
    accountBuyAt:{
        type:Date,
        default:Date.now()
    }
})
accountSchema.post('save',(error,doc,next)=>{
    (error.code===11000)?next(new JoiError("UniqueAccountError","Your accountPhoneNumber is repetitive",40,400,{"pointer":"/account/create","parameter":"req.data"})):next()
})
module.exports = mongoose.model('accounts',accountSchema);