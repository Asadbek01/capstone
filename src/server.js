import express  from "express"
import cors  from "cors"
import listEndpoints  from "express-list-endpoints"
import mongoose  from "mongoose"
import productRouter from "./service/product/index.js"
import { notFoundHandler,
     badRequestHandler,
      forbiddenError, 
      genericErrorHandler,
       unauthorizedError } from "./errorHandlers/index.js"
import userRouter from "./service/product/user.js"
import googleStrategy from "./utils/oauth.js"
import passport from "passport"

const server = express();
const port = process.env.PORT 


server.use(express.json());
server.use(cors());
passport.use("google", googleStrategy)

server.use('/books', productRouter)
server.use('/users', userRouter)


// ************ Error Handlers **********
server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(forbiddenError)
server.use(genericErrorHandler)
server.use(unauthorizedError)





mongoose.connect(process.env.MONGODB_CONNECTION);
mongoose.connection.on("connected", () => {
    console.log("Connected to Mongo!");
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.table(listEndpoints(server));
    });
});
mongoose.connection.on("error", (err) => {
    console.log(err);
}); 