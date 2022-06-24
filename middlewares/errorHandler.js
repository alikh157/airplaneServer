import {Error} from 'jsonapi-serializer';
import JoiError from "../exceptions/validationError";

export default (error, req, res, next) => {
    console.log(error)
    return res.status(error.status ? error.status : 500).json(new Error(error));
}