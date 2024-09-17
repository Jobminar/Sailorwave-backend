import express from 'express'
import userAuthRouter from '../router/user.routes.js'

import adminRouter from '../router/admin.routes.js'

const app=express()

app.use("/user",userAuthRouter)

app.use("/admin",adminRouter)

export default app