import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import validator from "validator"
import jwt from "jsonwebtoken"
const { Schema, model } = mongoose


const UserModel = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please insert your name"]

        },
        lastname: {
          type: String,
          required: [true, "Please insert your lastname"]

      },
        email: {
            type: String,
            required: [true, ' Please insert your email'],
            validate: [validator.isEmail, "Please insert a valid email adress"]
        },
       
         role:{ type: String, enum: ["user", "admin"], default: "user"},
        password: {
            type: String,
            required: [true, 'Insert your password'],
            minlength: [6, 'Your Password must be longer then 6 characters'],
        },
        avatar: {
          
            public_id: {type: String, default: "avatar/images_lyk4bu"},
              url:{type: String, default: 'https://res.cloudinary.com/strive01/image/upload/v1646033501/avatar/images_lyk4bu.jpg'}
        },
        googleId: {type: String},
        resetPasswordToken: String,
        resetPasswordExpire: Date

    },
    {timestamps : true}
    )
 


UserModel.pre('save' , async function (next) {
    const newUser = this
    const plainPw = newUser.password
 if(newUser.isModified('password')){
     const hash = await bcrypt.hash(plainPw, 10)
     newUser.password = hash
 }

  next()

})
UserModel.methods.toJson = function(){
    const userDocument = this 
    const userProperty = userDocument.toObject()
    delete userProperty.password
      return userProperty
    
  }

  UserModel.statics.checkCredentials = async function (email, plainPw ) {

    const user = await this.findOne({ email }) 
  
    if (user) {
      const isMatch = await bcrypt.compare(plainPw, user.password)
      if (isMatch) {
        return user
      } else {
        return null
      }
    } else {
      return null
    }
  }
  // Return JWT token
UserModel.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "1 week"
  });
}

// Generate password reset token
// userSchema.methods.getResetPasswordToken = function () {
//   // Generate token
//   const resetToken = crypto.randomBytes(20).toString('hex');

//   // Hash and set to resetPasswordToken
//   this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

//   // Set token expire time
//   this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

//   return resetToken

// }


export default model("user", UserModel)