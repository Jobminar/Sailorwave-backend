import express from 'express'
import userAuthRouter from '../user/user-auth/user-auth-route/user.auth.route.js'
import userApplicationRouter from '../user/user-application/user-application-route/user.application.route.js'
import userAddressRouter from '../user/user-address/user-address-route/user.address.route.js'
import userEducationalRouter from '../user/user-educational/user-educational-router/user.educational.router.js'
import userDocumentsRouter from '../user/user-documents/user-documents-router/user.documents.router.js'

const app=express()

app.use("/user-auth",userAuthRouter)

app.use("/user-application",userApplicationRouter)

app.use("/user-address",userAddressRouter)

app.use("/user-educational",userEducationalRouter)

app.use("/user-documents",userDocumentsRouter)

export default app