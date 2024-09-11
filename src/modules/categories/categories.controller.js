import slugify from "slugify"
import { Category } from "../../../database/models/category.model.js"
import { AppError } from "../../utlities/appError.js"
import { messages } from "../../utlities/messages.js"
import { catchError } from "../../middleware/catchError.js"
import { deleteOne } from "../handlers/handlers.js"
import { apiFeatures } from "../../utlities/apifeatures.js"

const addCategory = catchError(async (req, res) => {
    req.body.slug = slugify(req.body.name)
    req.body.image = req.file.filename
    let category = new Category(req.body)
    await category.save()
    res.status(201).json({ message: messages.category.addedSuccessfully, data: category })
}
)
const getCategories = catchError(
    async (req, res,next) => {

        let apiFeature = new apiFeatures(Category.find(), req.query)
            .pagination()
            .fields()
            .filter()
            .sort()
            .search()
        let category = await apiFeature.mongooseQuery
        if (!category.length) {
            return next(new AppError(messages.category.notFound, 404));
        }
        return res.json({
            message: messages.category.successGet,
            page: apiFeature.pageNumber,
            data: category,
        });
    }

)
const getCategory = catchError(async (req, res, next) => {
    const category = await Category.findById(req.params.id)
    category || next(new AppError(messages.category.notFound, 404));
    !category ||
        res.json({ message: messages.category.successGet, data: category });
});



const updateCategory = catchError(async (req, res, next) => {
    console.log(req.body.name);
    req.body.name ? (req.body.slug = slugify(req.body.name)) : "";
    req.file ? (req.body.image = req.file.filename) : "";
    let category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    category || next(new AppError(messages.category.notFound, 404))
    !category || res.json({ message: messages.category.updatedSuccessfully, data: category });
})

const deleteCategory = deleteOne(Category)





export {
    addCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}