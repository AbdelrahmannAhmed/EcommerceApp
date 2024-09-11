import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import { bootstrap } from './src/modules/bootstrap.js'
import { globalErrorHandler } from './src/middleware/globalErrorHandler.js'
import 'dotenv/config'
import cors from 'cors';
import { AppError } from './src/utlities/appError.js'
import { catchError } from './src/middleware/catchError.js'
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51PxPqmKqvu2FZJSx1vusCcphYAIHO0V08t76yjQ8C8ljZn8wejGKGUVVA8831tIKyKyyD6j2b1WjQNgPoTPGOzoe00I2MvtyQT');


const app = express()
const port = process.env.PORT || 3000
app.post('/api/webhook', express.raw({ type: 'application/json' }), catchError((req, res) => {
  const sig = req.headers['stripe-signature'].toString()

  let event = stripe.webhooks.constructEvent(req.rawBody, sig, "whsec_GrVWhLbsSaKE6QelVbbeKUFNd8H8nXip");
  let checkout
  if (event.type === 'checkout.session.completed') {
    checkout = event.data.object;
    console.log('Checkout Session completed:', checkout);
  }
  res.status(200).json({ received: true, checkout });
}));

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

