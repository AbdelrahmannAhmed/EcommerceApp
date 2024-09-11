import Joi from "joi";
import { objectIdValidation } from "../../middleware/objectIDValidation.js";




const addSubCategoryValidation = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    category: Joi.string().custom(objectIdValidation).optional(),
    createdby: Joi.string().custom(objectIdValidation).optional(),
    image: Joi.string().optional()
});

const updateSubCategoryValidation = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    category: Joi.string().custom(objectIdValidation).optional(),
    createdby: Joi.string().custom(objectIdValidation).optional(),
    id: Joi.string().custom(objectIdValidation).required(),
    image: Joi.string().optional()
});


export {
    addSubCategoryValidation,
    updateSubCategoryValidation
};
