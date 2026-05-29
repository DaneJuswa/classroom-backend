import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000


//middleware
app.use(express.json())
app.use('/', (req, res) =>{
    res.send("Test server'")
})

//create connection
app.listen(PORT, () => {
    console.log('Server Running on port')
})