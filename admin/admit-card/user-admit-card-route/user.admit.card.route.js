import express from 'express'
import admitCardController from "../user-admit-card-controller/user.admit.card.controller.js";

const router=express.Router()

router.post("/",admitCardController.createAdmitCard)

router.get("/",admitCardController.getAllAdmitCard)

router.delete("/:id",admitCardController.deleteAdmitCard)

router.get("/:applicationNumber",admitCardController.getApplicationNumberById)

export default router