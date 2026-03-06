import express from 'express';
import { createTodo, getTodos, getTodoById, updateTodo, toggleTodo, deleteTodo } from '../controllers/todo.controller.js';
const route = express.Router();


//create todo
route.post('/add', createTodo);

//get all todos
route.get('/', getTodos);
//get todo by id
route.get('/:id', getTodoById);
//updated todo by id
route.put('/:id', updateTodo);
//toggle TODO
route.patch('/:id/toggle', toggleTodo);
//delete todo
route.delete('/:id', deleteTodo);

export default route;