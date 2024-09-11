import slugify from "slugify";
import { Brand } from "../../../database/models/brand.model.js";
import { catchError } from "../../middleware/catchError.js";
import { messages } from "../../utlities/messages.js";
import { AppError } from "../../utlities/appError.js";
import { deleteOne } from "../handlers/handlers.js";

const addBrand = catchError(async (req, res, next) => {
    req.body.slug = slugify(req.body.name)
    req.body.image = req.file.filename
    console.log(req.body.image);
    let brand = new Brand(req.body)
    await brand.save()
    res.status(201).json({ message: messages.brand.addedSuccessfully, data: brand })
})

const getBrands = catchError(async (req, res, next) => {
    let brands = await Brand.find()
    res.json({ message: messages.brand.successGet, brands })
})


const getBrand = catchError(async (req, res, next) => {

    let brand = await Brand.findById(req.params.id)
    brand || next(new AppError(messages.category.notFound, 404))
    !brand || res.status(200).json({ message: messages.brand.successGet, data: brand })
})
const updateBrand = catchError(async (req, res, next) => {

    req.body.name ? (req.body.slug = slugify(req.body.name)) : ""

    req.file ? (req.body.image = req.file.filename) : ""
    console.log(req.body);
    console.log(req.file);
    let brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true })
    brand || next(new AppError(messages.category.notFound, 404))
    !brand || res.status(200).json({ message: messages.brand.updatedSuccessfully, data: brand })
})

const deleteBrand = deleteOne(Brand)

export {
    addBrand,
    getBrands,
    updateBrand,
    getBrand,
    deleteBrand
}