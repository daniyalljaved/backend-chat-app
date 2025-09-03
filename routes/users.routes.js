import express from "express";
import { getUsersFromSidebar } from "../controllers/users.controllers.js";
import protectRoute from "../middleware/protectroute.js";
const router=express.Router();

router.get("/",protectRoute,getUsersFromSidebar);


export default router;