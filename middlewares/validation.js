import Joi from 'joi';
import JoiError from "../Exceptions/validationError";

export const accountLoginValidation = (data, res, next) => {
    try {
        console.log("-------accountLoginValidation-------")
        const schema = Joi.object({
            accountPhoneNumber: Joi.string().required().min(11).max(11),
            accountPlainPassword: Joi.string().required().min(8)
                // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))

        });
        const result = schema.validate(data.body);
        result.error ? next(new JoiError("LoginValidationError", result.error.details[0].message, 44, 401, 1,
            {
                pointer: data.path,
                parameter: result.error.details[0].context.key,
            },
            {type: result.error.details[0].type, authors: ["kh444"]}
        )) : next();
    } catch (e) {
        next(e)
    }
}

export const accountRegisterValidation = (data,res,next) => {
    try {
        console.log("----------accountRegisterValidation-------------");
        const schema = Joi.object({
            accountPhoneNumber: Joi.string().min(11).max(11).required(),
            accountPlainPassword: Joi.string().required().min(8),
            accountEmail: Joi.string().min(10).max(35).required().email(),
        });
        const result = schema.validate(data.body);
        result.error ? next(new JoiError("RegisterValidationError", result.error.details[0].message, 44, 401, 1,
            {
                pointer: data.path,
                parameter: result.error.details[0].context.key,
            },
            {type: result.error.details[0].type, authors: ["kh444"]}
        )) : next();
    } catch (e) {
        next(e)
    }
}