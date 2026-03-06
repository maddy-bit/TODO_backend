import Todo from '../models/todo.model.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../middlewares/asyncHandler.js';

//create TODO-Post API
export const createTodo = asyncHandler(async (req, res) => {

    const { title, description } = req.body;

    //validation
    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Title is required",
        });
    }
    const todo = await Todo.create({
        title,
        description,
    });
    return res.status(201).json({
        success: true,
        message: "Todo created successfully",
        data: todo
    });
});






//GET API TODO
export const getTodos = asyncHandler(async (req, res) => {

    //query param
    const { search, sort, page = 1, limit = 10 } = req.query;
    //base query
    let query = {};
    //search by title
    if (search) {
        query.title = { $regex: search, $options: "i" };
    }
    //sorting
    let sortOption = {};
    if (sort === "asc") sortOption.createdAt = 1;//1 for ascending order
    else sortOption.createdAt = -1;//-1 for descending order

    //pagination
    const skip = (page - 1) * limit;
    const todos = await Todo.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    const totalTodos = await Todo.countDocuments(query);
    return res.status(200).json({
        success: true,
        message: "Todos fetched succesfully",
        total: totalTodos,
        page: Number(page),
        limit: Number(limit),
        data: todos,
    });




});

//GEt todo by TD
export const getTodoById = asyncHandler(async (req, res) => {

    const { id } = req.params;
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",

        })
    }
    const todo = await Todo.findById(id);
    //if todo is not found
    if (!todo) {
        return res.status(404).json({
            success: false,
            message: "Todo not found",
        })
    }
    //if todo found

    return res.status(200).json({
        success: true,
        message: "Todo fetched successfully",
        data: todo,
    })


});

//update todo by id-PUT API
export const updateTodo = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { title, description } = req.body;
    //valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",

        })
    }
    //vallid input
    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Title is required",

        });
    }
    //update todo
    const todo = await Todo.findByIdAndUpdate(
        id,
        { title, description },
        { new: true, runValidators: true }//to return the updated document
    );
    //if todo not found
    if (!todo) {
        return res.status(404).json({
            success: false,
            message: "Todo not found",

        });
    }
    //if todo  found and update
    return res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        data: todo,

    })




});

//PATCH API toggle todo
export const toggleTodo = asyncHandler(async (req, res) => {

    const { id } = req.params;
    //valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",

        });

    }
    //GET current todo
    const todo = await Todo.findById(id);
    //if todo not found
    if (!todo) {
        return res.status(404).json({
            success: false,
            message: "Todo not found",

        });

    }
    //FLIP the isCompleted 
    todo.isCompleted = !todo.isCompleted;
    await todo.save();
    //if todo found and updated
    return res.status(200).json({
        success: true,
        message: "Todo toggled successfully",
        data: todo,

    });



});

//DELETE TODO by id
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        //valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID",

            });

        }
        //delete todo
        const todo = await Todo.findByIdAndDelete(id);
        //if todo not found
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",

            });

        }
        //if todo found and deleted
        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
            data: todo,

        });
    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,

        })

    }
}