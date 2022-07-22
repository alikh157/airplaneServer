import express from 'express';
import {
    createTrip,
    readAllTrips,
    readSingleTrip,
    deleteTrip,
    updateTrip
} from '../controllers/tripController';

const tripRouter = express.Router();

tripRouter.post('/trip/create', [],createTrip);
tripRouter.post('/trip/read', [],readSingleTrip);
tripRouter.post('/trip/read/all', [],readAllTrips);
tripRouter.post('/trip/delete', [],deleteTrip);
tripRouter.post('/trip/update', [],updateTrip);

export default tripRouter;