import JoiError from "../exceptions/validationError";
import Ticket from '../models/tickets';
import {Serializer} from "jsonapi-serializer";
import mongoose from "mongoose";
import randomstring from 'randomstring';

export const createTicket = (req, res, next) => {
    try {
        console.log("-------makeTicket-------");
        const {
            ticketName,
            ticketDst,
            ticketSrc,
            ticketPrice,
            ticketInternalOrExternal,
            ticketBusinessOrEconomy,
            ticketNumber,
            ticketAirplaneId,
            ticketTakenBy
        } = req.body;
        Ticket.create({
            ticketName,
            ticketDst,
            ticketSrc,
            ticketPrice,
            ticketInternalOrExternal,
            ticketBusinessOrEconomy,
            ticketNumber,
            ticketPNR: randomstring.generate({
                charset: 'alphanumeric',
                length: 6
            }).toUpperCase(),
            ticketAirplaneId,
            ticketTakenBy
        }, (error) => {
            error ? next(error) : res.status(200).send();
        })
    } catch (error) {
        next(error)
    }
}
export const readTickets = (req, res, next) => {
    try {
        console.log("-------readTickets-------");
        // Ticket.find({}, (error, tickets) => {
        //     error ? next(error) : tickets.length === 0 ? next(new JoiError("NoTicketError", "There is no tickets in the database", 44, 404))
        //         : res.json(new Serializer('tickets', {
        //             attributes: ['ticketName', 'ticketDst', 'ticketSrc', 'ticketPrice',
        //                 'ticketInternalOrExternal',
        //                 'ticketBusinessOrEconomy',
        //                 'ticketPNR',
        //                 'ticketNumber', 'ticketAirplaneId', 'ticketTakenBy']
        //         }).serialize(tickets));
        // });
        Ticket.aggregate([
            {
                $lookup: {
                    from: 'airplanes',
                    localField: 'ticketAirplaneId',
                    foreignField: '_id',
                    as: 'ticketAirplaneObject'
                }
            },{
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
                            'airplaneCreateAt']
                    }
                }).serialize(tickets));
        });
    } catch (error) {
        next(error)
    }
}
export const readSingleTicket = (req, res, next) => {
    try {
        console.log("-------readSingleTicket-------");
        const {ticketId} = req.body
        Ticket.findOne({_id: ticketId}, (error, tickets) => {
            error ? next(error) : tickets === null ? next(new JoiError("NoTicketError", "There is no tickets in the database", 44, 404))
                : res.json(new Serializer('tickets', {
                    attributes: ['ticketName', 'ticketDst', 'ticketSrc', 'ticketPrice',
                        'ticketInternalOrExternal',
                        'ticketBusinessOrEconomy',
                        'ticketPNR',
                        'ticketNumber', 'ticketAirplaneId', 'ticketTakenBy']
                }).serialize(tickets));
        });
    } catch (error) {
        next(error)
    }
}
export const deleteTicket = (req, res, next) => {
    try {
        console.log("-------deleteTicket-------");
        const {ticketId} = req.body
        Ticket.findOneAndDelete({_id: mongoose.Types.ObjectId(ticketId)}, (error, ticket) => {
            error ? next(error) : ticket ? res.status(200).send() : next(new JoiError("NoTicketError", "There is no tickets in the database", 44, 404))
        })
    } catch (error) {
        next(error)
    }
}
export const updateTicket = (req, res, next) => {
    try {
        console.log("-------updateTicket-------");
        const {ticketId} = req.body
        const {
            ticketName,
            ticketDst,
            ticketSrc,
            ticketPrice,
            ticketInternalOrExternal,
            ticketBusinessOrEconomy,
            ticketNumber,
            ticketPNR,
            ticketAirplaneId,
            ticketTakenBy
        } = req.body;
        Ticket.findOneAndUpdate({_id: mongoose.Types.ObjectId(ticketId)}, {
            ticketName,
            ticketDst,
            ticketSrc,
            ticketPrice,
            ticketPNR: ticketPNR.toUpperCase(),
            ticketInternalOrExternal,
            ticketBusinessOrEconomy,
            ticketNumber,
            ticketAirplaneId,
            ticketTakenBy
        }, (error, ticket) => {
            error ? next(error) : ticket ? res.status(200).send() : next(new JoiError("NoTicketFound", "This ticket doesn't exist in database", 44, 404));
        })
    } catch (error) {
        next(error)
    }
}