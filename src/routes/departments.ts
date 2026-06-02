import express from "express";
import {db} from "../db/db";
import {departments, subjects} from "../db/schema/app";

const router = express.Router();

//get all departments
router.get("/", async (req, res) => {
    try{
        //query to fetch departments
        const departmentList = await db.select().from(departments);

        res.status(200).json({data: departmentList});

    }
    catch(err){
        res.status(500).json({error: err});
    }
})

export default router

