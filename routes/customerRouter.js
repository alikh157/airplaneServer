import express from 'express';
import {
    buyTicket,
    cancelTicket, searchTicket
} from '../controllers/costumerController'

const customerRouter = express.Router();

customerRouter.post('/customer/ticket/buy', [], buyTicket);
customerRouter.post('/customer/ticket/cancel', [], cancelTicket);
customerRouter.post('/customer/ticket/search', [], searchTicket);


export default customerRouter;