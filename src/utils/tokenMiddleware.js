import userSchema from "../service/schema/userSchema.js"
import createError from "http-errors"
import { verifyToken } from "./jwtTool.js"
import jwt  from "jsonwebtoken"


export const JwtAuthMiddleware = async(req, res, next) => {

  const  { token } = req.cookies
  if (!token) {
    next(
      createError(401, "Please login first in order to access!")
      )
    } 
    console.log("asa", token)
      
    const user =  verifyToken(token)
    req.user = await userSchema.findById(user.id)
    
    next()
  }
 

