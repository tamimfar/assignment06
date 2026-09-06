import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import { authRouter } from "./app/module/auth/auth.route";
import { areaRouter } from './app/module/areas/area.route';
import { scheduleRouter } from './app/module/schedules/schedule.route';
import { complaintRouter } from './app/module/complaints/complaint.route';
import { assignmentRouter } from './app/module/assignments/assignment.route';
import { paymentRouter } from './app/module/payments/payment.route';
import { reviewRouter } from './app/module/reviews/review.route';
import { adminRouter } from './app/module/admin/admin.route';
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "../src/app/config/swagger";
const app: Application = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true

}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})
app.use("/auth", authRouter);
app.use("/areas", areaRouter);
app.use("/schedules", scheduleRouter);
app.use("/complaints", complaintRouter);
app.use("/assignments",assignmentRouter);
app.use("/payments",paymentRouter);
app.use("/reviews",reviewRouter);
app.use("/admin",adminRouter);
app.use(globalErrorHandler);
export default app