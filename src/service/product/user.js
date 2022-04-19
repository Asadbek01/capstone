import express from "express"
import userSchema from "../schema/userSchema.js"
import { JwtAuth } from "../../utils/jwtTool.js"
// import createError from "http-errors"
// import { AdminonlyMiddleware } from "../admin/admin.js"
import { JwtAuthMiddleware } from "../../utils/tokenMiddleware.js"
import passport from "passport"
import createHttpError from "http-errors"
import sendEmail from "../../utils/SendingEmail.js"
import crypto from "crypto"
import { cloudinary, parser } from "../../utils/cloudinary.js"
const userRouter = express.Router()

// 1
userRouter.post("/register", async(req, res, next) => {
    try {
        const user = new userSchema(req.body)
        await user.save()
        const accessToken = await JwtAuth(user)
        res.send({ accessToken })
    } catch (error) {
       next(error) 
    }
}) 

// 2
userRouter.get("/",   async (req, res, next) => {
    try {
        const user = await userSchema.find()
          res.send(user)
        
    } catch (error) {
      next(error)
    }
})
userRouter.get("/logout", async (req, res, next) => {
  try {
  localStorage.removeItem('MyToken')
   res.status(200).json({
   success: true,
   message: "Successfully logged out"
   })
} catch (error) {
    next(error.message)
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

userRouter.put("/me/update",  parser.single("avatarImage"),  JwtAuthMiddleware, async (req, res, next) => {
  try {
  // const user = await userSchema.findByIdAndUpdate(req.user._id, req.body, {
  //   new: true,
  // });
  // if (user) {
  //   res.send(user);
  // }
  const newUserData = {
    name: req.body.name,
    email: req.body.email
}

const user = await userSchema.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
})

  //update avatar
  const body = req.body;

  console.log('body:', body);
  console.log('req:', req);


  const name = body.name;
  const email = body.email;

  const updates = {
      name,
      email,
      };

  if (req.file) {
      const image = req.file.filename;
      updates.image = image;
  }

res.status(200).json({
  success: true,
  user
})
  } catch (error) {
      next(error)
  }
})

// userRouter.post("/me/avatar", parser.single('userAvatar'),  JwtAuthMiddleware, async (req, res, next) => {
//   try {
//     res.json(req.file)

//   } catch (error) {
//       next(error)
//   }
// })
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
          res.send({ accessToken })
      }else{
          throw new createHttpError(401, "Crediantials are not ok")
      }
  } catch (error) {
      next(error)
    }
  })  

  userRouter.post("/password/forgot", async(req, res, next) => {
    const user =  await userSchema.findOne({email: req.body.email})
    if(!user) return next(createHttpError(404, 'User not found with  this email'))
const resetToken =  user.getResetPasswordToken()
await user.save({validateBeforeSave: false}) 

// Create resrt password url
 const resetUrl = `${req.protocol}://${req.get('host')}/users/password/reset/${resetToken}`
 const message = `Your password reset token is as follow: \n\n${resetUrl}\n\n if you have not requested skip it`
try {
  await sendEmail({
    email: user.email,
    subject: "Asadbek's project Password Recovery",
    message
  })
res.status(200).json({
  success: true,
  message: `Email sent to: ${user.email}`
})

} catch (error) {
  user.resetPasswordToken= undefined
  user.resetPasswordExpire= undefined

await user.save({validateBeforeSave: false})
return next(createHttpError(500, error.message))
}
  })

  userRouter.put("/password/reset/:token", async(req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user =  await userSchema.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()}
    })
    if(!user) return next(createHttpError(400, "Password reset token invalid or expired"))
   if(req.body.password !== req.body.confirmPassword) return next(createHttpError(400, "Password doesn't match"))
  user.password =req.body.password
   user.resetPasswordToken= undefined
   user.resetPasswordExpire= undefined
   await user.save()
   res.send(user)
  })



export default userRouter