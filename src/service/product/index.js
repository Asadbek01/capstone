import express from "express"
import ProductModel from "../schema/index.js"
import q2m from 'query-to-mongo'
const productRouter = express.Router()
// 1
productRouter.post("/new", async (req, res, next) => {
    try {
        const newProduct = new ProductModel(req.body)
        const product = await newProduct.save()
        if (!product) throw Error("Error in new Product")
        res.status(201).send(product)
    } catch (error) {
        next(error)
    }
})
// 2
productRouter.get("/", async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const { criteria, options } = query
        let { sort, skip, limit } = options
        limit = limit || 10
        const totalBooks = await ProductModel.countDocuments(criteria)
        const book = await ProductModel.find(query.criteria)    
        .sort(sort)
        .skip(skip || 0)
        .limit(limit) 
        const pages = Math.ceil(totalBooks / limit)
        res.status(200).send({ totalBooks, pages, book, })    
    } catch (error) {
        next(error)
    }
})
// 3
productRouter.get("/:id", async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        if(!product){
            res.status(404).json({
                success: false,
                    message: `This book with id of ${req.params.id} not found`
                    }) 
        }else{
            res.status(200).send(product)    

        }
    } catch (error) {
        next(error)
    }
})
// 4
productRouter.put("/:id", async (req, res, next) => {
    try {
        const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).send(product)  
    } catch (error) {
        next(error)
    }
})
// 5
productRouter.delete("/:id", async (req, res, next) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id)
        await product.remove()
        res.status(200).json({
            success: true,
            message: "The book deleted successfully",
                })  
    } catch (error) {
        next(error)
    }
})
export default productRouter    