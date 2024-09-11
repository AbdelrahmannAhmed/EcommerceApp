import { addressRouter } from "./address/address.routes.js"
import { authRouter } from "./auth/auth.routes.js"
import { brandRouter } from "./brand/brand.routes.js"
import { cartRouter } from "./cart/cart.routes.js"
import { categoriesRouter } from "./categories/categories.routes.js"
import { couponRouter } from "./coupon/coupon.routes.js"
import { orderRouter } from "./order/order.routes.js"
import { productRouter } from "./product/product.route.js"
import { reviewRouter } from "./Review/review.routes.js"
import { subCategoryRouter } from "./subcategories/subcategory.route.js"
import { userRouter } from "./users/user.routes.js"
import { wishListRouter } from "./wishlist/wishlist.routes.js"

export const bootstrap = (app) => {
    app.use('/api/categories', categoriesRouter)
    app.use('/api/subcategories', subCategoryRouter)
    app.use('/api/brand', brandRouter)
    app.use('/api/product', productRouter)
    app.use('/api/user', userRouter)
    app.use('/api/auth', authRouter)
    app.use('/api/reviews', reviewRouter)
    app.use('/api/wishlist', wishListRouter)
    app.use('/api/addresses', addressRouter)
    app.use('/api/coupons', couponRouter)
    app.use('/api/carts', cartRouter)
    app.use('/api/orders', orderRouter)








}