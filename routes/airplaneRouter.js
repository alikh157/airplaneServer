import express from 'express';
import {
    createAirplane,
    deleteAirplane,
    readAirplanes,
    readSingleAirplane,
    updateAirplane,
    uploadImgAirplanes,
    giveImage
} from '../controllers/airplaneController';

const airplaneRouter = express.Router();

airplaneRouter.post('/airplane/create', [],createAirplane);
airplaneRouter.post('/airplane/get', [],readAirplanes);
airplaneRouter.post('/airplane/read', [],readSingleAirplane);
airplaneRouter.post('/airplane/delete', [],deleteAirplane);
airplaneRouter.post('/airplane/update', [],updateAirplane);
airplaneRouter.post('/airplane/upload/img', [],uploadImgAirplanes)
airplaneRouter.get('/airplane/get/img', [],giveImage)

export default airplaneRouter;