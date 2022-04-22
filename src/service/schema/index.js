import mongoose from "mongoose"

const {model, Schema}= mongoose
 const ProductModel = new Schema({

    title: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product can exceed 99 char"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        trim: true,
        maxLength: [5, "Product can exceed 99 char"],
        default: 0.0
    },
    stock: {
        type: Number,
        required: [true, "Please insert stock value"]

    },
    subtitle: {
        type: String,
        required: [true, "Please enter product description"],
    },
    ratings: {
        type: Number,
        default: 0
    },
    
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            imgUrl: {
                type: String,
                required: true
            },
          
            

        }],
        category:{
            type: String,
            required: [true,"Please select category"],
            enum:{
                values:[
                    "All",
                    'History',
                    'Poetry',
                    'Philosophy',
                    'Religion',
                    'Fiction',
                    'Comedy',
                    "Computer-Science"
                ],
                message: "Please select the category "
            }
        },
        
        numReviews:{
            type: Number,
            default:0
        },
        reviews:[
        {
            name:{
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }],

        createdAt:{
            type: Date,
            default: Date.now
        }

})
export default model("Product", ProductModel)