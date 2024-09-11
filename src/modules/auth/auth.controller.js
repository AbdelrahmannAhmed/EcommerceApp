import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
const signup = catchError(async (req, res, next) => {
  let user = new User(req.body)
  await user.save()
  let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
  res.status(200).json({ message: 'Success', token })
});

const signIn = catchError(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email })
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
    res.json({ message: 'Successfull', token })
  } next(new AppError('Incorrect Email or Password', 401))
});

const changeUserPassword = catchError(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email })
  if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
    await User.findOneAndUpdate({ email: req.body.email }, { password: req.body.newPassword, passwordChangedAt: Date.now() })
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
    res.json({ message: 'Password Changed Successfully', token })
  } next(new AppError('Incorrect Email or Password', 401))

})

const protectedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers
  let userPayload = null
  if (!token) return next(new AppError('Token not provided', 401))
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(new AppError(err, 401))
    userPayload = payload

  })
  let user = await User.findById({ _id: userPayload.userId })
  if (!user) return next(new AppError('User not found', 401))
  if (user.passwordChangedAt) {
    let userPasswordChangeTime = parseInt(user.passwordChangedAt.getTime() / 1000)
    if (userPasswordChangeTime > userPayload.iat) return next(new AppError('Invalid Token...login again', 401))

  }

  req.user = user
  next()
})


const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {

    if (roles.includes(req.user.role)) {
      return next()
    } return next(new AppError('you are not authorized', 401))
  })
}






export {
  allowedTo, changeUserPassword,
  protectedRoutes, signIn, signup
};

