import slugify from "slugify";
import { Product } from "../../../database/models/product.model.js";
import { catchError } from "../../middleware/catchError.js";
import { messages } from "../../utlities/messages.js";
import { AppError } from "../../utlities/appError.js";
import { deleteOne } from "../handlers/handlers.js";
import { parse } from "uuid";
import { apiFeatures } from "../../utlities/apifeatures.js";




const addProduct = catchError(async (req, res, next) => {
    req.body.slug = slugify(req.body.title)
    req.body.image = req.files.image[0].filename
    req.body.images = req.files.images.map((img) => img.filename)

    let product = new Product(req.body)
    await product.save()
    res.status(201).json({ message: messages.product.addedSuccessfully, product })
})

const getProducts = catchError(async (req, res, next) => {
    console.log(req.query);
    let apiFeature = new apiFeatures(Product.find(), req.query)
        .pagination().fields().filter().sort().search()
    let products = await apiFeature.mongooseQuery
    products || next(new AppError(messages.product.notFound, 404));
    !products ||
        res.json({
            message: messages.product.successGet,
            pageNumber: apiFeature.pageNumber,
            data: products
        });
})

const getProduct = catchError(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    product || next(new AppError(messages.product.notFound, 404));
    !product || res.json({ message: messages.product.successGet, data: product });
})

const deleteProduct = deleteOne(Product)

const updateProduct = catchError(async (req, res, next) => {

    req.body.title ? (req.body.slug = slugify(req.body.title)) : "";

    if (req.files) {
        if (req.files.image && req.files.image.length) {
            req.body.image = req.files.image[0].filename;
        }
        if (req.files.images && req.files.images.length) {
            req.body.images = req.files.images.map((img) => img.filename);
        }
    }


    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!product) {
        return next(new AppError(messages.product.notFound, 404));
    }
    res.json({
        message: messages.product.updatedSuccessfully,
        data: product,
    });
});

export {
    addProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
}