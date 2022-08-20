import JoiError from "../exceptions/validationError";
import Customer from '../models/customers';
import Ticket from '../models/tickets';
import {Serializer} from "jsonapi-serializer";
import Trip from "../models/trips";

export const buyTicket = (req, res, next) => {
    try {
        console.log("-------buyTicket-------");
        //token mikhad
        const {accountId: customerAccountId} = req.user;
        const {
            customerTicketId,
            customerEnglishName,
            customerEnglishFamilyName,
            customerPersianName,
            customerPersianFamilyName,
            customerNationalCode,
            customerAge
        } = req.body;
        Customer.create({
            customerTicketId,
            customerEnglishName,
            customerEnglishFamilyName,
            customerPersianName,
            customerPersianFamilyName,
            customerNationalCode,
            customerAccountId,
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
            //zarfiat afzayesh peyda kone dobare!s
            error ? next(error) : customer ? res.status(200).send() : next()
        })
    } catch (error) {
        next(error)
    }
}

export const searchTrip = (req, res, next) => {
    try {
        console.log("-------searchTrip-------");
        const {query} = req.body;
        Trip.aggregate([
            {
                $lookup: {
                    from: 'airplanes',
                    let: {'tripAirplaneId': '$tripAirplaneId'},
                    as: 'airplaneObject',
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', "$$tripAirplaneId"]
                                }
                            }
                        },
                        {
                            $project: {
                                tripAirplaneId: '$_id',
                                tripAirplaneAirlineName: '$airplaneAirlineName',
                                tripAirplaneModel: '$airplaneModel',
                                tripAirplaneImageSrc: '$airplaneImageSrc',
                                tripAirplaneCapacity: '$airplaneCapacity',
                                tripAirplaneFlightNumber: '$airplaneFlightNumber',
                                tripAirplaneCreateAt: '$airplaneCreateAt',
                            },
                        }
                    ],
                },

            },
            {
                $match: {
                    $or: [
                        {
                            'airplaneObject.tripAirplaneAirlineName': {$regex: query, $options: 'i'}
                        }, {
                            'airplaneObject.tripAirplaneModel': {$regex: query, $options: 'i'}
                        },  {
                            'airplaneObject.tripAirplaneFlightNumber': {$regex: query, $options: 'i'}
                        }, {
                            'tripTakeOffTime': {$regex: query, $options: 'i'}
                        }, {
                            'tripLandingTime': {$regex: query, $options: 'i'}
                        }, {
                            'tripInternalOrExternal': {$regex: query, $options: 'i'}
                        },
                        {
                            'tripDate': {$regex: query, $options: 'i'}
                        },
                        {
                            'ticketNumber': {$regex: query, $options: 'i'}
                        },
                        {
                            'tripSrc': {$regex: query, $options: 'i'}
                        }, {
                            'tripDst': {$regex: query, $options: 'i'}
                        },
                        {
                            'tripPrice': {$regex: query, $options: 'i'}
                        },
                    ]
                },
            },
            {
                $project: {
                    tripId: '$_id',
                    tripName: 1,
                    tripDst: 1,
                    tripSrc: 1,
                    tripPrice: 1,
                    tripTakeOffTime: 1,
                    tripLandingTime: 1,
                    tripDate: 1,
                    tripInternalOrExternal: 1,
                    tripBusinessOrEconomy: 1,
                    tripAirplaneObject: {$arrayElemAt: ["$airplaneObject", 0]},
                }
            }
        ]).exec((error, trips) => {
            error ? next(error) :
                res.json(new Serializer('trips', {
                    attributes: [
                        'tripId',
                        'tripAirplaneObject',
                        'tripName',
                        'tripDst',
                        'tripSrc',
                        'tripPrice',
                        'tripTakeOffTime',
                        'tripLandingTime',
                        'tripDate',
                        'tripInternalOrExternal',
                        'tripBusinessOrEconomy',
                    ],
                    tripAirplaneObject: {
                        attributes: [
                            'tripAirplaneId',
                            'tripAirplaneAirlineName',
                            'tripAirplaneModel',
                            'tripAirplaneImageSrc',
                            'tripAirplaneCapacity',
                            'tripAirplaneFlightNumber',
                            'tripAirplaneCreateAt',
                        ]
                    }
                }).serialize(trips));
        });
    } catch (error) {
        next(error)
    }
}
