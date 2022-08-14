import express from 'express';
import {
    buyTicket,
    cancelTicket, searchTrip
} from '../controllers/customerController'

const customerRouter = express.Router();

customerRouter.post('/customer/ticket/buy', [], buyTicket);
customerRouter.post('/customer/ticket/cancel', [], cancelTicket);
customerRouter.post('/customer/ticket/search', [], searchTrip);


export default customerRouter;