
 const sendToken = (accessToken, statusCode, res) => {
     const token = accessToken
         //  options for cookie
     const options = {
        expiresIn: "1 week",
         httpOnly: true
        }
        // console.log(process.env.COOKIE_EXPIRES_TIME)
      res.status(statusCode).cookie("token",token, options).json({
          success: true,
          token,
          
      })
    }

export default sendToken