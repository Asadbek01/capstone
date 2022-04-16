
 const sendToken = (accessToken, statusCode, res) => {
     const token = accessToken
         //  options for cookie
     const options = {
         expiresIn: new Date(
             Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
         ),
         httpOnly: true
        }
        // console.log(process.env.COOKIE_EXPIRES_TIME)
      res.status(statusCode).cookie("token",token, options).json({
          success: true,
          token,
          
      })
    }

export default sendToken