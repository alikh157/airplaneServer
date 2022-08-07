import express from 'express';
import {
    loginAccount,
    signupAccount,
    updateAccount,
    readAccount
} from '../controllers/accountController'

const accountRouter = express.Router();

accountRouter.post('/account/create', [], signupAccount);
accountRouter.post('/account/login', [], loginAccount);
accountRouter.post('/account/read', [], readAccount);
accountRouter.post('/account/update', [], updateAccount);


export default accountRouter;