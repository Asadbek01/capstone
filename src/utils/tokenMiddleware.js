// import userSchema from "../service/schema/userSchema.js"
// import createError from "http-errors"
// import jwt from "jsonwebtoken"

// export const JwtAuthMiddleware = async(req, res, next) => {

//   const  { token } = req.cookies
//   if (!token) {
//     next(
//       createError(401, "Please login first in order to access!")
//       )
//     } 
//     console.log("asa", token)
      
//     const user =  jwt.verify(token, process.env.JWT_SECRET)
//     req.user = await userSchema.findById(user.id)
    
//     next()
//   }
 
import createHttpError from "http-errors";
import { verifyToken } from "./jwtTool.js";

export const JwtAuthMiddleware = async(req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next(
        createHttpError(
          401,
          "please provide bearer token in authorization headers!"
        )
      );
    } else {
      const token = req.headers.authorization.replace("Bearer ", "");
      if (!token) return res.status(401).send({ error: "No token provided" });
      const payload = await verifyToken(token);

      req.user = {
        _id: payload._id,
        role:payload.role
      };
      next();
    }
  } catch (error) {
    next(createHttpError(401, "User is unauthorized!"));
  }
};
