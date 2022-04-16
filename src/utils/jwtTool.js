import jwt from "jsonwebtoken"

export const JwtAuth = async user => {
        const  accessToken = await generateToken({_id: user._id })
        return accessToken
    }

 export const generateToken = payload =>
new Promise((resolved, rejected) =>
jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: "1 week"}, (err, token) =>{
    if (err) rejected (err)
    else resolved(token)
})
)


export const verifyToken = token => 
new Promise((res, rej) =>
jwt.verify(JSON.stringify(token), process.env.JWT_SECRET, (err , payload) =>{
    if (err) rej(err)
    else res(payload)
})
) 

// const generateRefreshJwtToken = payload =>
// new Promise ((rejected, resolved) =>
// jwt.sign(payload, process.env.REFRESH_SECRET,{expiresIn: '1 week'}, (err,token) =>{
//     if(err) rejected(err)
//     else resolved(token)
// })
// )


// const verifyRefreshJwtToken = token =>
// new Promise ((rejected, resolved) =>
// jwt.verify(token, process.env.REFRESH_SECRET, (err,token) =>{
//     if(err) rejected(err)
//     else resolved(token)
// })
// )

// export const verifyTokenAndGenerateNewToken = async accessToken =>{
//     try {
//          const payload = await verifyJwtToken(currentRefreshToken)
//          const user = await userSchema.findById(payload._id)
//       if(!user){
//            throw new HttpError(404, `Author with id ${payload._id} didnt find`)
//       }
//       if(user.accessToken && user.accessToken === accessToken){
//            const {accesstoken} = await JwtAuth(user)
//            return {accesstoken, refreshToken}
//       }else{
//            throw new HttpError(401, " token not valid!")
//       }
//          } catch (err) {
//               throw new HttpError(401, " token expired!")
//     }
// }