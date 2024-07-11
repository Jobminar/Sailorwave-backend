import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()
//
const app=express()

const PORT=process.env.PORT 

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('mongodb connected successfully'))
.catch((err)=>console.log('mongodb disconnected',err))

app.listen(()=>console.log(`server running ${PORT}`))
    