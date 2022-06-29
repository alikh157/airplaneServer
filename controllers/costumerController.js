import JoiError from "../exceptions/validationError";
import Customer from '../models/customers';
import Ticket from '../models/tickets';

export const buyTicket = (req, res, next) => {
    try {
        console.log("-------buyTicket-------");
        const {
            customerTicketId,
            customerEnglishName,
            customerEnglishFamilyName,
            customerPersianName,
            customerPersianFamilyName,
            customerNationalCode,
            customerPhoneNumber,
            customerEmail,
            customerAge
        } = req.body;
        Customer.create({
            customerTicketId,
            customerEnglishName,
            customerEnglishFamilyName,
            customerPersianName,
            customerPersianFamilyName,
            customerNationalCode,
            customerPhoneNumber,
            customerEmail,
            customerAge
        }, (error) => {
            //we have to adding counter-- for ticket capacity
            error ? next(error) : res.status(200).send();
        })
    } catch (error) {
        next(error)
    }
}

export const cancelTicket = (req, res, next) => {
    try {
        console.log("-------cancelTicket-------");
        const {customerId} = req.body;
        Customer.findOneAndUpdate({_id: customerId}, {customerCanceled: true}, (error, customer) => {
            error ? next(error) : customer ? res.status(200).send() : next()
        })
    } catch (error) {
        next(error)
    }
}

export const searchTicket = (req, res, next) => {
    try {
        console.log("-------searchTicket-------");
        const {query} = req.body;

    } catch (error) {
        next(error)
    }
}
