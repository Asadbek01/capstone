import userSchema from "../service/schema/userSchema.js"
import createError from "http-errors"
import { verifyToken } from "./jwtTool.js"
import jwt  from "jsonwebtoken"


export const JwtAuthMiddleware = async(req, res, next) => {

  const  {token}  = req.cookies
  if (!token) {
    next(
      createError(401, "Please login first in order to access!")
      )
    } 
    console.log(token)
      
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await userSchema.findById(decoded.id)
    
    next()
  }
 

