// import createHttpError from "http-errors";

// export const AdminonlyMiddleware = (req, res, next) => {
//     console.log(req.user)
//       if (req.user.role === "admin") {
//         next()
//       }else{
//         next(createHttpError(403, "Only admin is allowed!"))
//     }
// }