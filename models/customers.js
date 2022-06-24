import mongoose from "mongoose";
import JoiError from "../Exceptions/validationError";

const customerSchema = new mongoose.Schema({
    customerEnglishName:{
        type:String,
        required:true,
    },
    customerEnglishFamilyName:{
        type:String,
        required:true,
    },
    customerPersianName:{
        type:String,
        required:true,
    },
    customerPersianFamilyName:{
        type:String,
        required:true,
    },
    customerAge:{
        type:String,
        required:true,
    },
    customerEmail:{
        type:String,
        trim:true
    },
    customerNationalCode:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    customerPhoneNumber:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    customerTicketId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"tickets"
    },
    customerCanceled:{
        type:Boolean,
        required:true,
        default:false
    },
    customerBuyAt:{
        type:Date,
        default:Date.now()
    }
})
customerSchema.post('save',(error,doc,next)=>{
    (error.code===11000)?next(new JoiError("UniqueCustomerError","Your nationConde is repetitive",40,400,{"pointer":"/admin/takeTicket","parameter":"req.data"})):next()
})
module.exports = mongoose.model('customers',customerSchema);