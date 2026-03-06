import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todo.routes.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.middlewares.js';

dotenv.config();
const app = express();
// const PORT=3001;

//Middleware
app.use(cors());
app.use(express.json());

//Connect to databse
connectDB();

//ROUTEs
app.use('/api/todos', todoRoutes);
//error handler middleware
app.use(errorHandler);


//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);

});