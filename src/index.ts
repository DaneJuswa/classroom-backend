import express from 'express'
import subjectsRouter from "./routes/subject";
import  cors from "cors";

const app = express()
const PORT = process.env.PORT || 3000


//middleware
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))


//route for subjects
app.use('/api/subjects', subjectsRouter);



//create connection
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
})