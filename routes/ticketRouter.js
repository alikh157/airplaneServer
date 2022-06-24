import express from 'express';
import {
    createTicket,
    readTickets,
    readSingleTicket,
    deleteTicket,
    updateTicket
} from '../controllers/ticketController';

const ticketRouter = express.Router();

ticketRouter.post('/ticket/create', [],createTicket);
ticketRouter.post('/ticket/read', [],readSingleTicket);
ticketRouter.post('/ticket/get', [],readTickets);
ticketRouter.post('/ticket/delete', [],deleteTicket);
ticketRouter.post('/ticket/update', [],updateTicket);

export default ticketRouter;