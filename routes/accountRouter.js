import express from 'express';
import {
    loginAccount,
    signupAccount,
    updateAccount,
    readAccount
} from '../controllers/accountController'
import {accountRegisterSanitization, accountLoginSanitization} from "../middlewares/sanitization";
import {accountRegisterValidation, accountLoginValidation} from "../middlewares/validation";
import authorization from "../middlewares/authorization";
import rateLimiting from "../middlewares/limiter";

const accountRouter = express.Router();

accountRouter.post('/account/create', [accountRegisterSanitization, accountRegisterValidation], signupAccount);
accountRouter.post('/account/login', [rateLimiting, accountLoginSanitization, accountLoginValidation], loginAccount);
accountRouter.post('/account/read', [authorization], readAccount);
accountRouter.post('/account/update', [authorization, accountRegisterSanitization, accountRegisterValidation], updateAccount);


export default accountRouter;