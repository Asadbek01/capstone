import express from "express"
import userSchema from "../schema/userSchema.js"
import { JwtAuth } from "../../utils/jwtTool.js"
// import createError from "http-errors"
// import { AdminonlyMiddleware } from "../admin/admin.js"
import { JwtAuthMiddleware } from "../../utils/tokenMiddleware.js"
import { MainAuthMiddleware } from "../../utils/MainAuthMiddleware.js"
import passport from "passport"
import createHttpError from "http-errors"
const userRouter = express.Router()
// 1
userRouter.post("/register", async(req, res, next) => {
    try {
        const user = new userSchema(req.body)
        const {_id} = await user.save()
        res.status(201).send({_id})
    } catch (error) {
       next(error) 
    }
}) 

// 2
userRouter.get("/", JwtAuthMiddleware,  async (req, res, next) => {
    try {
        const user = await userSchema.find()
          res.send(user)
        
    } catch (error) {
        next(error)
    }
})
userRouter.get(
    "/googleLogin",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  
  userRouter.get(
    "/googleRedirect",
    passport.authenticate("google"),  
    async (req, res, next) => {
      try {
        console.log("TOKENS: ", req.user.token);
  
        res.redirect(
          `${process.env.FE_URL}?accessToken=${req.user.token}`
        );
      } catch (error) {
        next(error);
      }
    }
  );
userRouter.get("/me",  JwtAuthMiddleware, async (req, res, next) => {
    try {
     
      const user = await userSchema.findById(req.user._id)
      res.send(user)
    } catch (error) {
        next(error)
    }
})
// 3
userRouter.get("/:id", async (req, res, next) => {
    try {
         const user = await userSchema.findById(req.params.id)
         res.status(201).send(user)
    } catch (error) {
        next(error)
    }
})
// 4
userRouter.put("/:id", async (req, res, next) => {
    try {
        const user = await userSchema.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(201).json({
            success: true,
            user})
    } catch (error) {
        next(error)
    }
})
// 5
userRouter.delete("/:id", async (req, res, next) => {
    try {
        const user = await userSchema.findByIdAndDelete(req.params.id)
        res.status(201).json({
            success: true,
            user})
    } catch (error) {
        next(error)
    }
})
userRouter.post("/login", async (req, res, next) => {
    try {
      const {email, password } = req.body
      console.log(email, password)
      const user = await userSchema.checkCredentials(email, password)
      if(user) {
          const accessToken = await JwtAuth(user)
          res.status(201).send({accessToken})
      }else{
          throw new createHttpError(401, "Crediantials are not ok")
      }
  } catch (error) {
      next(error)
    }
  })  

export default userRouter