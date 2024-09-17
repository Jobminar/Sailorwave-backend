import express from 'express'
import adminRouter from '../admin/admin-auth/admin-auth-route/admin.auth.route.js'
import subadminRouter from '../admin/sub-admin/sub-admin-route/subadmin.route.js'
import userAdmitCardRouter from '../admin/admit-card/user-admit-card-route/user.admit.card.route.js'
const app=express()

app.use("/admin-auth",adminRouter)
app.use("/sub-admin",subadminRouter)
app.use("/user-admit-card",userAdmitCardRouter)


export default app