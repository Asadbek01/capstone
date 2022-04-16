import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import validator from "validator"
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


export default model("user", UserModel)