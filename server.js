import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import airplaneRouter from './routes/airplaneRouter';
import ticketRouter from './routes/ticketRouter';
import customerRouter from "./routes/customerRouter";
import tripRouter from "./routes/tripRouter";
import accountRouter from "./routes/accountRouter";

const corsOptions = {
    origin: ['http://localhost:3000','http://localhost:3002',],
    credentials:true
}
dotenv.config();
mongoose.connect(process.env.DB_URL, () => console.log("database connected..."))
const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('./public'));
app.use('/', [airplaneRouter, ticketRouter,customerRouter,tripRouter,accountRouter]);
app.use(errorHandler);
const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`server up and running on ${port}`))