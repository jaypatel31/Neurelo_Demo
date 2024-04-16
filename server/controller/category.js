const pkg = require('neurelo-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { CategoriesApiService } = pkg;

const createCategory = async (req, res,next) => {
    const { id } = req.user;
    try{
        const categoryExist = await CategoriesApiService.findCategories({
            categoryName:true
        },{
            categoryName:req.body.categoryName,
        })
        console.log(categoryExist.data.data)
        
        if(categoryExist.data.data.length > 0){
            const err = new Error("Category Already Exist");
            err.status = 409;
            next(err);
            return;
        } 
        const response = await CategoriesApiService.createOneCategories({
            categoryName:req.body.categoryName,
        })

        const allCat = await CategoriesApiService.findCategories()

        res.status(200).json({data:allCat.data.data, message:"Category Created Successfully", new:response.data.data})
    }catch(e){
        console.log(e)
        res.status(400).json("Error in fetching all tasks")
    }
}

const getAllCategory = async(req,res,next) => {
    try{
        const allCat = await CategoriesApiService.findCategories()
        res.status(200).json({data:allCat.data.data})
    }catch(e){
        console.log(e)
        res.status(400).json("Error in fetching all tasks")
    }
}

module.exports = { createCategory, getAllCategory };