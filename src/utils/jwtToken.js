
//  const sendToken = (user, res) => {
//      const token = user.getJwtToken()
//          //  options for cookie
//      const cookieOptions = {
//         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        

//          httpOnly: true
//         }
//         // console.log(process.env.COOKIE_EXPIRES_TIME)
//       res.cookie("token", token, cookieOptions).json({
//           success: true,
//           token,
//           user
//       })
//     }

// export default sendToken