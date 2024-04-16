const pkg = require('neurelo-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { Users, UsersApiService } = pkg;

const createUser = async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        let hashedPwd = await bcrypt.hash('test1234', salt);
        await UsersApiService.createOneUsers({
            username:"test",
            email:"tester@gmail.com",
            passwordHash:hashedPwd,
            updatedAt:"2021-09-01T00:00:00.000Z",
        })
    }catch(e){
        console.log(e)
    }
  res.send("Create User Route");
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    let userDetails;

    UsersApiService.findUsersByEmail(email).then((response) => {
        userDetails = response.data.data;
        return bcrypt.compare(password, userDetails.passwordHash)
    }).then((resp)=>{
        if(resp){
            const token_send = jwt.sign({ id:userDetails.id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
                })
            res.status(200).json({
                user:{
                    id: userDetails.id,
                    username: userDetails.username,
                    email: userDetails.email,
                    task: userDetails.tasks
                },
                message:'Logged In Successfully!',
                token: token_send
            })
        }else{
            res.status(400).json({error:"Invalid Password"})
        }
    }).catch((e) => {
        console.log(e.request.data)
        res.status(400).json({message:"Password or Email is incorrect"})
    })
}

const getAllTask = async (req, res) => {
    const { id } = req.user;
    try{
        const response = await UsersApiService.findUsersById(id,{
            tasks:true,
            username:true,
            email:true
        })
        res.status(200).json({data:response.data.data})
    }catch(e){
        console.log(e)
        res.status(400).json("Error in fetching all tasks")
    }
}

const createTask = async (req, res, next) => {
    const { id } = req.user;
    try{
        const objectId = new ObjectId();
        const taskExist = await UsersApiService.findUsers({
            tasks:true
        },{
            id: id,
        })

        let tasks = taskExist.data.data[0].tasks

        tasks.push({
            id: objectId,
            title:req.body.taskName,
            description:req.body.taskDescription,
            status:req.body.taskStatus,
            categoryIds:req.body.taskCategories,
            dueDate:new Date(req.body.taskDueDate),
            updatedAt:new Date()
        })
        const response = await UsersApiService.updateUsersById(id,{
            tasks,
            updatedAt:new Date()
        })
        res.status(200).json({data:response.data.data, message:"Task Updated Successfully"})
    }catch(e){
        console.log(e.response.data)
        res.status(400).json("Error in fetching all tasks")
    }
}

const updateTask = async (req, res, next) => {
    const { id } = req.user;
    try{
        const taskExist = await UsersApiService.findUsers({
            tasks:true
        },{
            id: id,
        })

        let tasks = taskExist.data.data[0].tasks

        tasks = tasks.map((task) => {
            if(task.id === req.body.taskId){
                return {
                    id: task.id,
                    title:req.body.taskName,
                    description:req.body.taskDescription,
                    status:req.body.taskStatus,
                    categoryIds:req.body.taskCategories,
                    dueDate:new Date(req.body.taskDueDate),
                    updatedAt:new Date()
                }
            }
            return task
        })
        
        const response = await UsersApiService.updateUsersById(id,{
            tasks,
            updatedAt:new Date()
        })
        res.status(200).json({data:response.data.data, message:"Task Created Successfully"})
    }catch(e){
        console.log(e.response.data)
        res.status(400).json("Error in fetching all tasks")
    }
}

const deleteTask = async (req, res, next) => {
    const { id } = req.user;
    try{
        const taskExist = await UsersApiService.findUsers({
            tasks:true
        },{
            id: id,
        })

        let tasks = taskExist.data.data[0].tasks

        tasks = tasks.filter(task=>{
            return task.id !== req.params.id
        })
        
        const response = await UsersApiService.updateUsersById(id,{
            tasks,
            updatedAt:new Date()
        })
        res.status(200).json({data:response.data.data, message:"Task Deleted Successfully"})
    }catch(e){
        console.log(e.response.data)
        res.status(400).json("Error in fetching all tasks")
    }
}

module.exports = { createUser, loginUser, getAllTask, createTask, updateTask, deleteTask };