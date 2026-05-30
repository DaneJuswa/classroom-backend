import {integer, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

//each object are tables with keys
const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}

//table for departments
export const departments = pgTable("departments", {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    code: varchar('code', {length: 50}).notNull().unique(),
    name: varchar('name', {length: 255}).notNull(),
    description: varchar('description', {length: 255}),
    ...timestamps
})

//table for subjects
export const subjects = pgTable("subjects", {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    department: integer('department_id').notNull().references(() => departments.id, {onDelete:'restrict'}),
    name: varchar('name', {length: 255}).notNull(),
    code: varchar('code', {length: 50}).notNull().unique(),
    description: varchar('description', {length: 255}),
    ...timestamps
})

// export const departmentRelations = relations(departments, ({many}) => ({subjects:many(subjects)}))
export const department = relations(departments, ({many}) => ({subjects:many(subjects)}))
export const subjectRelations = relations(subjects, ({one, many}) => ({
    department: one(departments, {
        fields: [subjects.department],
        references: [departments.id]
    })

}))

//automatically infers the type of Department
export type Department =  typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Subjects = typeof subjects.$inferSelect;
export type newSubjects = typeof subjects.$inferInsert