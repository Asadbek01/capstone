import createHttpError from "http-errors"
import  atob  from "atob"
import userSchema from "../service/schema/userSchema.js"
export const MainAuthMiddleware = async (req, res, next) => {

//1 First I have to check AUTHORIZATION if it is not in the place ----> trigger error
if(!req.headers.authorization){
    next(createHttpError(401, "Please provide your credentials in the header"))
} else {
    // 2 If I have recived AUTHORIZATION header i have to extract it  to plainText
    const base64 = req.headers.authorization.split(" ")[1]
    const [ email, password] =  atob(base64).split(":")

    // 3 having obtained the credential I have to check in db by (email) , and also compare recived password with hashed one

    const user = await userSchema.checkCredentials(email, password)
    if (user) {
        // 4. If credentials are ok, we can proceed to what is next (another middleware or route handler)
        req.user = user
        next()
      } else{
           // 5. If credentials are NOT ok (email not found OR password not correct) --> trigger an error (401)
      next(createHttpError(401, "Credentials are not OK!"))
      }
}

}