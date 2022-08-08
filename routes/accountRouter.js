import express from 'express';
import {
    loginAccount,
    signupAccount,
    updateAccount,
    readAccount
} from '../controllers/accountController'
import {accountRegisterSanitization,accountLoginSanitization} from "../middlewares/sanitization";
import {accountRegisterValidation,accountLoginValidation} from "../middlewares/validation";

const accountRouter = express.Router();

accountRouter.post('/account/create', [accountRegisterSanitization,accountRegisterValidation], signupAccount);
accountRouter.post('/account/login', [accountLoginSanitization,accountLoginValidation], loginAccount);
accountRouter.post('/account/read', [], readAccount);
accountRouter.post('/account/update', [], updateAccount);


export default accountRouter;