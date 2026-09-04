import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import { authRouter } from "./app/module/auth/auth.route";
import { areaRouter } from './app/module/areas/area.route';
const app:Application = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true

}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!')
})
app.use("/auth", authRouter);
app.use("/areas", areaRouter);
app.use(globalErrorHandler);
export default app