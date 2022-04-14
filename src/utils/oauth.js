import passport from "passport"
import { Strategy } from "passport-google-oauth20"
import User from "../service/schema/userSchema.js"
import {JwtAuth} from "../utils/jwtTool.js"

process.env.TS_NODE_DEV && require("dotenv").config()

console.log(process.env.GOOGLE_ID)
const googleStrategy = new Strategy({
  clientID: process.env.GOOGLE_ID || "",
  clientSecret: process.env.GOOGLE_SECRET || "",
  callbackURL: `${process.env.API_URL}/users/googleRedirect`,
  passReqToCallback: true
},
  async function (request, accessToken, refresh, profile, done) {
    try {
      console.log(profile)

      if (profile.emails && profile.emails.length > 0) {
        const user = await User.findOne({ googleId: profile.id })

        if (user) {
          const token = await JwtAuth(user)
          done(null, { _id: user._id, token })
        } else {
          // 4. Else if the user is not in our db --> add the user to db and then create token(s) for him/her

          const newUser = new User({
            name: profile.name?.givenName,
            surname: profile.name?.familyName,
            email: profile.emails[0],
            googleId: profile.id,
          })

        //   const savedUser = await newUser.save()
          const token = await JwtAuth(newUser)

          done(null, { _id: newUser._id, token })
        }
      }
    } catch (error) {
      done(error)
    }
  }
)




passport.serializeUser((data, done) => {
  done(null, data)
})

export default googleStrategy