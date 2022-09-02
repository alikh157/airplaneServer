import JoiError from "../exceptions/validationError";
import Trip from '../models/trips';
import Airplane from '../models/airplanes';
import {Serializer} from "jsonapi-serializer";
import mongoose from "mongoose";

export const createTrip = (req, res, next) => {
    try {
        console.log("-------createTrip-------");
        const {
            tripAirplaneId,
            tripName,
            tripDst,
            tripSrc,
            tripPrice,
            tripTakeOffTime,
            tripLandingTime,
            tripDate,
            tripInternalOrExternal,
            tripBusinessOrEconomy,
        } = req.body;
        Trip.create({
            tripAirplaneId,
            tripName,
            tripDst,
            tripSrc,
            tripPrice,
            tripTakeOffTime,
            tripLandingTime,
            tripDate,
            tripInternalOrExternal,
            tripBusinessOrEconomy,
        }, (error, trip) => {
            error ? next(error) : Airplane.findOneAndUpdate({_id: tripAirplaneId}, {$push: {airplaneTripId: trip._id}}, (error, airplane) => {
                error ? next(error) : airplane ? res.status(200).send() : next(new JoiError("AirplaneNotFound", "This airplane doesn't exist.", 44, 404))
            })
        })
    } catch (error) {
        next(error)
    }
}

export const readAllTrips = (req, res, next) => {
    try {
        console.log("-------readAllTrips-------");
        Trip.aggregate([
            {
                $match: {}
            }, {
                $lookup: {
                    from: 'airplanes',
                    let: {'tripAirplaneId': '$tripAirplaneId'},
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
                        },
                    ],
                    as: 'airplaneObject',
                }
            }, {
                $project: {
                    tripId: '$_id',
                    tripAirplaneObject: {$arrayElemAt: ["$airplaneObject", 0]},
                    tripName: 1,
                    tripDst: 1,
                    tripSrc: 1,
                    tripPrice: 1,
                    tripTakeOffTime: 1,
                    tripLandingTime: 1,
                    tripDate: 1,
                    tripInternalOrExternal: 1,
                    tripBusinessOrEconomy: 1,
                }
            }
        ]).exec((error, go) => {
            if (error)
                next(error)
            else if (go === null)
                next(new JoiError("NoTripError", "There is no trips in the database", 44, 404))
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
    } catch (error) {
        next(error)
    }
}
export const readSingleTrip = (req, res, next) => {
    try {
        console.log("-------readSingleTrip-------");
        const {tripId} = req.body
        Trip.aggregate([
            {
                $match: {_id: mongoose.Types.ObjectId(tripId)}
            }, {
                $lookup: {
                    from: 'airplanes',
                    let: {'tripAirplaneId': '$tripAirplaneId'},
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
                        },
                    ],
                    as: 'airplaneObject',
                }
            }, {
                $project: {
                    tripId: '$_id',
                    tripAirplaneObject: {$arrayElemAt: ["$airplaneObject", 0]},
                    tripName: 1,
                    tripDst: 1,
                    tripSrc: 1,
                    tripPrice: 1,
                    tripTakeOffTime: 1,
                    tripLandingTime: 1,
                    tripDate: 1,
                    tripInternalOrExternal: 1,
                    tripBusinessOrEconomy: 1,
                }
            }
        ]).exec((error, trip) => {
            error ? next(error) : trip === null ? next(new JoiError("NoTripError", "There is no trips in the database", 44, 404))
                : res.json(new Serializer('trip', {
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
                }).serialize(trip));
        });
    } catch (error) {
        next(error)
    }
}
export const deleteTrip = (req, res, next) => {
    try {
        console.log("-------deleteTrip-------");
        const {tripId} = req.body
        Trip.findOneAndDelete({_id: mongoose.Types.ObjectId(tripId)}, (error, ticket) => {
            error ? next(error) : ticket ? Airplane.findOneAndUpdate({_id: ticket.tripAirplaneId}, {$pull: {airplaneTripId: tripId}}, (error, airplane) => {
                error ? next(error) : airplane ? res.status(200).send() : next(new JoiError("AirplaneNotFound", "This airplane doesn't exist.", 44, 404))
            }) : next(new JoiError("NoTripError", "There is no trips in the database", 44, 404))
        })
    } catch (error) {
        next(error)
    }
}
export const updateTrip = (req, res, next) => {
    try {
        console.log("-------updateTrip-------");
        const {
            tripId,
            tripAirplaneId,
            tripName,
            tripDst,
            tripSrc,
            tripPrice,
            tripTakeOffTime,
            tripLandingTime,
            tripDate,
            tripInternalOrExternal,
            tripBusinessOrEconomy,
        } = req.body;
        Trip.findOneAndUpdate({_id: mongoose.Types.ObjectId(tripId)}, {
            tripAirplaneId,
            tripName,
            tripDst,
            tripSrc,
            tripPrice,
            tripTakeOffTime,
            tripLandingTime,
            tripDate,
            tripInternalOrExternal,
            tripBusinessOrEconomy,
        }, (error, trip) => {
            error ? next(error) : trip ? res.status(200).send() : next(new JoiError("NoTripFound", "This trip doesn't exist in database", 44, 404));
        })
    } catch (error) {
        next(error)
    }
}