const express = require("express")
const cors = require("cors")


//routes
const UserRoutes = require("./routes/UserRoutes")

require('dotenv').config()
const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))


//routes
app.use('/users', UserRoutes)


app.listen(port, ()=>{
    console.log(`Server is running in http://localhost:${port}`)
})