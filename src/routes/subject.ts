import express from 'express';
import { or, ilike, sql, getTableColumns, desc, and, eq } from "drizzle-orm";

import {db} from "../db/db";
import {departments, subjects} from "../db/schema/app";

const router = express.Router();

//get all subjects with optional search and pagination
router.get('/', async  (req, res) => {
    try {
        const {search, department, page = 1, limit = 10} = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = []

        //if search query exist, filter by name or subject code
        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`),
                ))
        }

        if (department) {
            filterConditions.push(
                or(
                    ilike(departments.name, `%${search}%`)
                )
            )
        }


        //combine all filters
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({
                count: sql<number>`count(*)`
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.department, departments.id))
            .where(whereClause)

        const totalCount = countResult[0]?.count ?? 0;

        //query to fetch subjects
        const subjectList = await db.
            select({...getTableColumns(subjects), department: {...getTableColumns(departments)}})
            .from(subjects).leftJoin(departments, eq(subjects.department, departments.id))
            .where(whereClause)
            .orderBy(desc(subjects.createdAt))
            .offset(offset)


        res.status(200).json({
            data: subjectList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage)
            }
        })

    }catch (e) {
        res.status(400).send({error: e});
    }
})



export default router;