import Airplane from '../models/airplanes';
import File from '../models/files';
import JoiError from "../exceptions/validationError";
import {Serializer} from 'jsonapi-serializer';
import path from 'path';
import multer from 'multer';
import fs from "fs";
import mongoose from "mongoose";

export const createAirplane = (req, res, next) => {
    try {
        console.log("-------createAirplane-------");
        const {
            airplaneAirlineName,
            airplaneModel,
            airplaneDst,
            airplaneSrc,
            airplaneImageSrc,
            airplaneCapacity,
            airplaneFlightNumber,
            airplaneTicketTakeOffTime,
            airplaneTicketLandingTime
        } = req.body;
        Airplane.create({
            airplaneAirlineName,
            airplaneModel,
            airplaneDst,
            airplaneSrc,
            airplaneImageSrc,
            airplaneCapacity,
            airplaneFlightNumber,
            airplaneTicketTakeOffTime,
            airplaneTicketLandingTime
        }, (error) => {
            error ? next(error) : res.status(200).send();
        })
    } catch (error) {
        next(error)
    }
}

export const readAirplanes = (req, res, next) => {
    try {
        console.log("-------readAirplanes-------");
        Airplane.find({}, (error, airplanes) => {
            error ? next(error) : (airplanes.length === 0) ? next(new JoiError('NoAirplaneError', 'There is no airplane in database', 44, 404))
                : res.json(new Serializer('airplanes', {
                    attributes: ['airplaneAirlineName', 'airplaneModel',
                        'airplaneDst', 'airplaneSrc', 'airplaneImageSrc',
                        'airplaneFlightNumber',
                        'airplaneCapacity',
                        'airplaneTicketTakeOffTime',
                        'airplaneTicketLandingTime',
                        'airplaneCreateAt'
                    ]
                }).serialize(airplanes));
        });
    } catch (error) {
        next(error)
    }
}

export const readSingleAirplane = (req, res, next) => {
    try {
        console.log("-------readSingleAirplane-------");
        const {airplaneId} = req.body;
        Airplane.findOne({_id: mongoose.Types.ObjectId(airplaneId)}, (error, airplanes) => {
            error ? next(error) : airplanes === null ? next(new JoiError('NoAirplaneError', 'There is no airplane in database', 44, 404))
                : res.json(new Serializer('airplanes', {
                    attributes: ['airplaneAirlineName', 'airplaneModel',
                        'airplaneDst', 'airplaneSrc', 'airplaneImageSrc',
                        'airplaneFlightNumber',
                        'airplaneCapacity',
                        'airplaneTicketTakeOffTime',
                        'airplaneTicketLandingTime',
                        'airplaneCreateAt'
                    ]
                }).serialize(airplanes));
        });
    } catch (error) {
        next(error)
    }
}

export const deleteAirplane = (req, res, next) => {
    try {
        console.log("-------deleteAirplane-------");
        const {airplaneId} = req.body;
        Airplane.findOneAndDelete({_id:mongoose.Types.ObjectId(airplaneId)},(error,airplane)=>{
            error?next(error):airplane?res.status(200).send():next(new JoiError("AirplaneNotFound","This airplane doesn't exist.",44,404))
        })
    } catch (error) {
        next(error)
    }
}

export const updateAirplane = (req, res, next) => {
    try {
        console.log("-------updateAirplane-------");
        const {airplaneId} = req.body;
        const {
            airplaneAirlineName,
            airplaneModel,
            airplaneDst,
            airplaneSrc,
            airplaneImageSrc,
            airplaneCapacity,
            airplaneFlightNumber,
            airplaneTicketTakeOffTime,
            airplaneTicketLandingTime
        } = req.body;
        Airplane.findOneAndUpdate({_id:mongoose.Types.ObjectId(airplaneId)},{
            airplaneAirlineName,
            airplaneModel,
            airplaneDst,
            airplaneSrc,
            airplaneImageSrc,
            airplaneCapacity,
            airplaneFlightNumber,
            airplaneTicketTakeOffTime,
            airplaneTicketLandingTime
        }, (error,airplane) => {
            error ? next(error) : airplane?res.status(200).send():next(new JoiError("AirplaneNotFound","This airplane doesn't exist.",44,404))
        })
    } catch (error) {
        next(error)
    }
}

export const uploadImgAirplanes = (req, res, next) => {
    try {
        console.log("-------uploadImgAirplanes-------");
        const storage = multer.diskStorage({
            destination: './public/uploads',
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + 'img' + '-' + Date.now() + path.extname(file.originalname));
            }
        });

        //init
        function checkFileType(file, cb) {
            const fileTypes = /jpeg|jpg|png/;
            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
            if (extname) {
                return cb(null, true);
            } else {
                next(new JoiError("FileTypeError", "You can only select png ,jpeg or jpg file.", 40, 400));
            }
        }

        const uploader = multer({
            storage: storage,
            limits: {fileSize: 1000000},
            fileFilter: function (req, file, cb) {
                checkFileType(file, cb);
            }
        }).single('file');
        //use it
        uploader(req, res, error => {
            if (error) {
                next(new JoiError("UploadImageError", "Your filename is not correct", 40, 400));
            } else {
                if (req.file === undefined) {
                    next(new JoiError("NoFileError", "It looks like you don't select any image", 40, 400));
                } else {
                    File.create({
                        fileName: req.file.filename,
                        fileType: path.extname(req.file.originalname).toLowerCase(),
                        fileDestination: req.file.path,
                        fileOriginalName: req.file.originalname,
                        fileSize: req.file.size
                    }, (error) => {
                        error ? next(error) : res.status(200).send();
                    });
                }
            }
        });
    } catch (error) {
        next(error);
    }
}
export const giveImage = (req, res, next) => {
    try {
        console.log("-------giveImage-------");
        const {fileName} = req.query
        console.log(fileName)
        File.findOne({fileName: fileName}, (error, file) => {
            if (error)
                next(error)
            else if (file) {
                let filestream = fs.createReadStream(file.fileDestination);
                filestream.pipe(res);
            } else
                next(new JoiError("notFoundError", "This file doesn't exist in database", 40, 404, {
                    pointer: req.path,
                    parameter: "input"
                }))
        })
    } catch (e) {
        next(e);
    }
}