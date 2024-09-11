import { AppError } from "../utlities/appError.js";

export const validate = (schema) => {
  return (req, res, next) => {

    const validationObject = {
      ...req.body,
      ...req.params,
      ...req.query,
      image: req.file
    };



    const { error } = schema.validate(validationObject, {
      abortEarly: false,
    });

    if (!error) {
      next();
    } else {
  
      let errorMsg = error.details.map((err) => err.message);
      next(new AppError(errorMsg, 401));
    }
  };
};
