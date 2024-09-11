import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import { bootstrap } from './src/modules/bootstrap.js'
import { globalErrorHandler } from './src/middleware/globalErrorHandler.js'
import 'dotenv/config'
import cors from 'cors';
import { AppError } from './src/utlities/appError.js'
import { catchError } from './src/middleware/catchError.js'
import Stripe from 'stripe';
import { Cart } from './database/models/cart.model.js'
import { Order } from './database/models/order.model.js'
import { User } from './database/models/user.model.js'
import { Product } from './database/models/product.model.js'
const stripe = new Stripe('sk_test_51PxPqmKqvu2FZJSx1vusCcphYAIHO0V08t76yjQ8C8ljZn8wejGKGUVVA8831tIKyKyyD6j2b1WjQNgPoTPGOzoe00I2MvtyQT');


const app = express()
const port = process.env.PORT || 3000
app.post('/api/webhook', express.raw({ type: 'application/json' }), catchError(async (req, res) => {
  const sig = req.headers['stripe-signature'].toString()
  let event = stripe.webhooks.constructEvent(req.body, sig, "whsec_XdRxm4HvyuNx8ccedonlrBjk15hXYvnM");

  let checkout
  if (event.type == 'checkout.session.completed') {
    checkout = event.data.object;
    let user = await User.findOne({ email: checkout.customer_email })
    let cart = await Cart.findById(checkout.client_reference_id)
    if (!cart) return next(new AppError('Cart is not found', 404))
    let totalOrderPrice = cart.totalCartPrice || cart.totalCartPriceAfterDiscount
    let order = new Order({
      user: user._id,
      orderItems: cart.cartItems,
      shippingAddress: checkout.metadata,
      totalOrderPrice: checkout.amount_total / 100,
      paymentType: 'card',
      isPaid: true
    })
    await order.save()

    // for (let i = 0; i < order.orderItems.length; i++) {
    //     let product = await Product.findById(order.orderItems[i].product)
    //     product.soldItems += order.orderItems[i].quantity
    //     product.stock -= order.orderItems[i].quantity
    //     product.save()


    // }
    let options = cart.cartItems.map((prod) => {
      return ({
        updateMany: {
          "filter": { _id: prod.product },
          "update": {
            $inc: { soldItems: prod.quantity, stock: - prod.quantity }
          }
        }
      })
    })

    await Product.bulkWrite(options)
    await Cart.deleteOne({ _id: cart._id });


  }
  res.json({ message: "Success", data: checkout });
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

