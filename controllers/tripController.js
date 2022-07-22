import JoiError from "../exceptions/validationError";
import Trip from '../models/trips';
import Airplane from '../models/airplanes';
import {Serializer} from "jsonapi-serializer";
import mongoose from "mongoose";

export const createTrip = (req, res, next) => {
    try {
        console.log("-------createTrip-------");
        const {
            airplaneId,
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
            error ? next(error) : Airplane.findOneAndUpdate({_id: airplaneId}, {$push: {airplaneTripId: trip._id}}, (error, airplane) => {
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
            },
            {
                $project: {
                    tripId: '$_id',
                    tripName: 1,
                    tripDst: 1,
                    tripSrc: 1,
                    tripPNR: 1,
                    tripPrice: 1,
                    tripInternalOrExternal: 1,
                    tripBusinessOrEconomy: 1,
                    tripIsCanceled: 1,
                    tripCreateAt: 1,
                }
            }
        ]).exec((error, trips) => {
            error ? next(error) :
                res.json(new Serializer('trips', {
                    attributes: [
                        'tripId',
                        'tripName',
                        'tripDst',
                        'tripSrc',
                        'tripPrice',
                        'tripInternalOrExternal',
                        'tripBusinessOrEconomy',
                        'tripCreateAt',
                        'tripIsCanceled'
                    ],
                    // tripObject: {
                    //     attributes: ['airplaneAirlineName',
                    //         'airplaneModel',
                    //         'airplaneImageSrc',
                    //         'airplaneCapacity',
                    //         'airplaneFlightNumber',
                    //         'airplaneTicketTakeOffTime',
                    //         'airplaneTicketLandingTime',
                    //         'airplaneCreateAt']
                    // }
                }).serialize(trips));
        });
    } catch (error) {
        next(error)
    }
}
export const readSingleTrip = (req, res, next) => {
    try {
        console.log("-------readSingleTrip-------");
        const {tripId} = req.body
        Trip.findOne({_id: tripId}, (error, trip) => {
            error ? next(error) : trip === null ? next(new JoiError("NoTripError", "There is no trips in the database", 44, 404))
                : res.json(new Serializer('trip', {
                    attributes: [
                        'tripName', 'tripDst', 'tripSrc', 'tripPrice',
                        'tripInternalOrExternal',
                        'tripBusinessOrEconomy',
                        'tripCreateAt',
                        'tripIsCanceled'
                    ]
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
            error ? next(error) : ticket ? res.status(200).send() : next(new JoiError("NoTripError", "There is no trips in the database", 44, 404))
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
            tripName,
            tripDst,
            tripSrc,
            tripPrice,
            tripInternalOrExternal,
            tripBusinessOrEconomy,
            tripCreateAt,
            tripIsCanceled
        } = req.body;
        Trip.findOneAndUpdate({_id: mongoose.Types.ObjectId(tripId)}, {
            tripName,
            tripDst,
            tripSrc,
            tripPrice,
            tripInternalOrExternal,
            tripBusinessOrEconomy,
            tripCreateAt,
            tripIsCanceled
        }, (error, trip) => {
            error ? next(error) : trip ? res.status(200).send() : next(new JoiError("NoTripFound", "This trip doesn't exist in database", 44, 404));
        })
    } catch (error) {
        next(error)
    }
}