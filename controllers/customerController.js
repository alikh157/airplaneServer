import JoiError from "../exceptions/validationError";
import Customer from '../models/customers';
import Account from '../models/accounts';
import Airplane from '../models/airplanes';
import Ticket from '../models/tickets';
import {Serializer} from "jsonapi-serializer";
import Trip from "../models/trips";
import randomstring from "randomstring";

export const buyTicket = (req, res, next) => {
    try {
        console.log("-------buyTicket-------");
        //token mikhad
        const {userId: customerAccountId} = req.user;
        const {
            tripId,
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
        }, (error, customer) => {
            //we have to adding counter-- for ticket capacity
            if (error)
                next(error)
            else {
                Ticket.create({
                    ticketNumber: randomstring.generate({
                        charset: 'numeric',
                        length: 8
                    }),
                    ticketPNR: randomstring.generate({
                        charset: 'alphanumeric',
                        length: 6
                    }).toUpperCase(),
                    ticketTripId: tripId,
                    ticketTakenBy: customer._id
                }, (error, ticket) => {
                    error ? next(error) : Trip.findOne({_id: tripId}, (error, trip) => {
                        error ? next(error) : trip ? Airplane.findOneAndUpdate({_id: trip.tripAirplaneId}, {airplaneCapacity: (airplaneCapacity - 1)}, (error, airplane) => {
                            error ? next(error) : airplane ? Account.findOneAndUpdate({_id: customerAccountId}, {accountTicketId: ticket._id}, {},
                                (error) => {
                                    error ? next(error) : res.status(200).send()
                                }) : next(new JoiError("AirplaneNotFound", "This airplane doesn't exist.", 44, 404))
                        }) : next(new JoiError("TripNotFound", "This trip doesn't exist.", 44, 404))
                    })
                })
            }
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
        const {src, dst, isOneWay, startDate, endDate, InternalOrExternal, BusinessOrEconomy} = req.body;
        if (isOneWay === "true") {
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
                        $and: [
                            {
                                'tripInternalOrExternal': {$regex: InternalOrExternal}
                            },
                            {
                                'tripBusinessOrEconomy': {$regex: BusinessOrEconomy}
                            },
                            {
                                'tripDate': {$regex: startDate, $options: 'i'}
                            },
                            {
                                'tripSrc': {$regex: src, $options: 'i'}
                            },
                            {
                                'tripDst': {$regex: dst, $options: 'i'}
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
            ]).exec((error, go) => {
                if (error)
                    next(error)
                else {
                    const trips = [{"go": go}];
                    res.json(new Serializer('trips', {
                        attributes: ['go'],
                        go: {

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
                        }
                    }).serialize(trips));
                }
            });

        } else if (isOneWay !== "true") {
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
                        $and: [
                            // {
                            //     'tripInternalOrExternal': {$regex: query, $options: 'i'}
                            // },
                            {
                                "tripDate": {"$gte": startDate, "$lte": endDate}
                            },
                            {
                                'tripSrc': {$regex: src, $options: 'i'}
                            },
                            {
                                'tripDst': {$regex: dst, $options: 'i'}
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
            ]).exec((error, go) => {
                error ? next(error) : Trip.aggregate([
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
                            $and: [
                                {
                                    'tripInternalOrExternal': {$regex: InternalOrExternal}
                                },
                                {
                                    'tripBusinessOrEconomy': {$regex: BusinessOrEconomy}
                                },
                                {
                                    "tripDate": {"$gte": startDate, "$lte": endDate}
                                },
                                {
                                    'tripSrc': {$regex: dst, $options: 'i'}
                                },
                                {
                                    'tripDst': {$regex: src, $options: 'i'}
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
                ]).exec((error, comeBack) => {
                    if (error)
                        next(error)
                    else if (comeBack) {
                        const trips = [{"comeBack": comeBack}, {"go": go}];
                        res.json(new Serializer('trips', {
                            attributes: ['comeBack', 'go'],
                            comeBack: {
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
                            },
                            go: {
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
                            }
                        }).serialize(trips));
                    }
                });
            });
        }
    } catch (error) {
        next(error)
    }
}
