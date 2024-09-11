import { Router } from "express";
import { uplaodMixOfFiles } from "../../fileUpload/fileUpload.js";
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from "./product.controller.js";
import { validate } from "../../middleware/validate.js";
import { addProductValidation, updateProductValidation } from "./product.validation.js";

export const productRouter = Router()


productRouter.route("/").
    post(
        uplaodMixOfFiles(
            [
                { name: "image", maxCount: 1 },
                { name: "images", maxCount: 10 },
            ],
            "products"
        ), validate(addProductValidation),
        addProduct).get(getProducts)

productRouter.route("/:id").get(getProduct).delete(deleteProduct)
productRouter.route("/:id").put(uplaodMixOfFiles([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 10 }], "products"), validate(updateProductValidation), updateProduct)