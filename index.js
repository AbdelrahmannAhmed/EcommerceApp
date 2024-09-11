import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import { bootstrap } from './src/modules/bootstrap.js'
import { globalErrorHandler } from './src/middleware/globalErrorHandler.js'
import 'dotenv/config'
import cors from 'cors';
import { AppError } from './src/utlities/appError.js'


const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"));
app.get('/', (req, res) => res.send('Hello World!'))
bootstrap(app)
app.use('*', (req, res, next) => {
    next(new AppError(`route is not found:${req.originalUrl}`))
})
app.use(globalErrorHandler)

process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection error:", err);
  });
  
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

