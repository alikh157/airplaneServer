import check from 'string-sanitizer' ;


export const accountRegisterSanitization = (req,res,next) =>{
    console.log("-------accountRegisterSanitization-------");
    req.body.accountPhoneNumber = check.sanitize.removeText(req.body.accountPhoneNumber);
    req.body.accountEmail = check.validate.isEmail(req.body.accountEmail);
    next();
}
export const accountLoginSanitization = (req,res,next) =>{
    console.log("-------accountLoginSanitization-------");
    req.body.accountPhoneNumber = check.sanitize.removeText(req.body.accountPhoneNumber);
    next();
}