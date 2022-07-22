import JoiError from "../exceptions/validationError";
import Customer from '../models/customers';
import Ticket from '../models/tickets';
import {Serializer} from "jsonapi-serializer";

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
        Ticket.aggregate([
            {
                $lookup: {
                    from: 'airplanes',
                    localField: 'ticketAirplaneId',
                    foreignField: '_id',
                    as: 'ticketAirplaneObject'
                }
            },
            {
                $match: {
                    $or: [
                        {
                            'airplane.airplaneAirlineName': {$regex: query, $options: 'i'}
                        }, {
                            'airplane.airplaneModel': {$regex: query, $options: 'i'}
                        }, {
                            'airplane.airplaneCapacity': {$regex: query, $options: 'i'}
                        }, {
                            'airplane.airplaneFlightNumber': {$regex: query, $options: 'i'}
                        }, {
                            'airplane.airplaneTicketTakeOffTime': {$regex: query, $options: 'i'}
                        }, {
                            'airplane.airplaneTicketLandingTime': {$regex: query, $options: 'i'}
                        },
                        {
                            'ticketNumber': {$regex: query, $options: 'i'}
                        },
                        {
                            'ticketSrc': {$regex: query, $options: 'i'}
                        },
                        {
                            'ticketPNR': {$regex: query, $options: 'i'}
                        },
                    ]
                },
            },
            {
                $project:{
                    ticketName:1,
                    ticketDst:1,
                    ticketSrc:1,
                    ticketPNR:1,
                    ticketPrice:1,
                    ticketInternalOrExternal:1,
                    ticketBusinessOrEconomy:1,
                    ticketNumber:1,
                    ticketIsCanceled:1,
                    ticketCreateAt:1,
                    ticketAirplaneObject: { $arrayElemAt: [ "$ticketAirplaneObject", 0 ] },
                }
            }
        ]).exec((error, tickets) => {
            error ? next(error) :
                res.json(new Serializer('tickets', {
                attributes: [
                    'ticketName',
                    'ticketDst',
                    'ticketSrc',
                    'ticketPNR',
                    'ticketPrice',
                    'ticketInternalOrExternal',
                    'ticketBusinessOrEconomy',
                    'ticketNumber',
                    'ticketAirplaneId',
                    'ticketIsCanceled',
                    'ticketCreateAt',
                    'ticketAirplaneObject'
                ],
                    ticketAirplaneObject: {
                    attributes: ['airplaneAirlineName',
                        'airplaneModel',
                        'airplaneImageSrc',
                        'airplaneCapacity',
                        'airplaneFlightNumber',
                        'airplaneTicketTakeOffTime',
                        'airplaneTicketLandingTime',
                        'airplaneCreateAt',]
                }
            }).serialize(tickets));
        });
    } catch (error) {
        next(error)
    }
}
