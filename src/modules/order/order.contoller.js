import { Cart } from "../../../database/models/cart.model.js";
import { Order } from "../../../database/models/order.model.js";
import { Product } from "../../../database/models/product.model.js";
import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51PxPqmKqvu2FZJSx1vusCcphYAIHO0V08t76yjQ8C8ljZn8wejGKGUVVA8831tIKyKyyD6j2b1WjQNgPoTPGOzoe00I2MvtyQT');


const createCashOrder = catchError(async (req, res, next) => {
    let cart = await Cart.findById(req.params.id)
    if (!cart) return next(new AppError('Cart is not found', 404))
    let totalOrderPrice = cart.totalCartPrice || cart.totalCartPriceAfterDiscount
    let order = new Order({
        user: req.user._id,
        orderItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: totalOrderPrice
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

    res.json({ message: "success", order })

})
//aa
const getUserOrder = catchError(async (req, res, next) => {

    let orders = await Order.find({ user: req.params.userid }).populate('orderItems.product')
    let user = await User.findById(req.params.userid)
    if (req.user._id != req.params.userid) return next(new AppError('User is not authorized to access this orders', 401))
    res.status(200).json({ message: `all order for user ${user.name}`, orders })

})

const getAllOrders = catchError(async (req, res, next) => {
    let orders = await Order.find()
    res.status(200).json({ message: `all Orders`, orders })

})

const createCheckoutSession = catchError(async (req, res, next) => {
    let cart = await Cart.findById(req.params.id)
    let totalOrderPrice = cart.totalCartPrice || cart.totalCartPriceAfterDiscount
    if (!cart) return next(new AppError('Cart is not found', 404))
    let session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "egp",
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name,
                    },
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: "https://hambozoo.netlify.app/#/orders",
        cancel_url: "https://hambozoo.netlify.app/#/cart",
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        metadata: req.body.shippingAddress,

    });
    res.status(200).json({ message: "success", data: session });
})





export {
    createCashOrder,
    getUserOrder,
    getAllOrders,
    createCheckoutSession
};

