import slugify from "slugify";
import { SubCategory } from "../../../database/models/subcategories.model.js";
import { catchError } from "../../middleware/catchError.js";
import { messages } from "../../utlities/messages.js";
import { AppError } from "../../utlities/appError.js";
import { deleteOne } from "../handlers/handlers.js";
import { apiFeatures } from "../../utlities/apifeatures.js";
import { Category } from "../../../database/models/category.model.js";

const addSubCategory = catchError(async (req, res) => {
    req.body.slug = slugify(req.body.name)
    let subcategory = new SubCategory(req.body)
    await subcategory.save()
    res.status(201).json({ message: messages.subCategory.addedSuccessfully, data: subcategory })
})

const getSubCategories = catchError(async (req, res) => {
    let filterObject = {}
    let category = await Category.findById(req.params.categoryid)
    if (req.params.categoryid) filterObject.category = req.params.categoryid
    let apiFeature = new apiFeatures(SubCategory.find(filterObject), req.query)
        .pagination()
        .fields()
        .filter()
        .sort()
        .search()
    // console.log(req.params);
    let subcategories = await apiFeature.mongooseQuery
    res.status(200).json({
        message: `all subcategories for ${category.name} category`,
        page: apiFeature.pageNumber,
        subcategories
    })
})

const updateSubcategory = catchError(async (req, res, next) => {
    req.body.name ? (req.body.slug = slugify(req.body.name)) : ""
    let subcategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true })
    subcategory || next(new AppError(messages.subCategory.notFound, 404));
    !subcategory || res.json({ message: messages.subCategory.updatedSuccessfully, data: subcategory });
})

const deleteSubCategory = deleteOne(SubCategory)

const getSubCategory = catchError(async (req, res, next) => {
    let subcategory = await SubCategory.findById(req.params.id)
    subcategory || next(new AppError(messages.subCategory.notFound, 404));
    !subcategory || res.json({ message: messages.subCategory.successGet, data: subcategory });
})

export {
    addSubCategory,
    getSubCategories,
    updateSubcategory,
    deleteSubCategory,
    getSubCategory
}