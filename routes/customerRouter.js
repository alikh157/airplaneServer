import express from 'express';
import {
    buyTicket,
    cancelTicket
} from '../controllers/costumerController'

const customerRouter = express.Router();

customerRouter.post('/customer/buy', [], buyTicket);
customerRouter.post('/customer/cancel', [], cancelTicket);



export default customerRouter;