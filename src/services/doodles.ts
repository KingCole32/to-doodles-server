import { Router, Request, Response } from "express";
import pool from "./db";
import { Doodle } from "../types";
import { QueryResult, ResultSetHeader } from "mysql2";

const router = Router();

export async function getDoodles(userId: string, page: string, offset: string, status: string, tags?: string): Promise<Array<Doodle>> {
  // page is sent from FE 1-based, so change to 0-based
  const offsetNum = (parseInt(page)-1) * parseInt(offset)
  const [result, ] = await pool.execute(
    `SELECT d.id, d.title, d.body, d.status, d.deadline, d.completed, d.updated, GROUP_CONCAT(mtm.tag_id) AS "tags"
    FROM doodle AS d
    INNER JOIN (
      SELECT d.id
      FROM doodle AS d
        LEFT JOIN tag_doodle_mtm AS mtm ON mtm.doodle_id = d.id
      WHERE user_id=${userId}
        ${status == "-1" ? "" : `AND status=${status}`} 
        ${tags ? `AND mtm.tag_id IN (${tags})` : ""} 
      ORDER BY  d.created, title, d.id
      ${offset == "-1" ? "" : `LIMIT ${parseInt(offset)+1} OFFSET ${offsetNum+1}`}
    ) AS temp USING (id)
    LEFT JOIN tag_doodle_mtm AS mtm ON mtm.doodle_id = d.id
    GROUP BY d.id`
  );

  console.log("LOG: getDoodles success with res ", (result as Array<Doodle>).length)
  return result as Array<Doodle>
};

export async function countDoodles(userId: string, status: string, tags?: string): Promise<number> {
  const [result, ] = await pool.execute(`
    SELECT COUNT(d.id) AS "total"
    FROM doodle AS d
      ${ tags ? "INNER JOIN tag_doodle_mtm AS mtm ON mtm.doodle_id = d.id" : "" }
    WHERE user_id=${userId}
      ${status == "-1" ? "" : `AND status=${status}`} 
      ${tags ? `AND mtm.tag_id IN (${tags})` : ""}
  `)

  console.log("LOG: Count doodles success with res ", result)
  return (result as Array<any>)[0]["total"]
}

export async function createDoodle( title: string, body: string, deadline: string, userId: string, tags?:string): Promise<number> {
  const [result, ] = await pool.execute(`
    INSERT INTO doodle (title, body, deadline, user_id)
    VALUES ("${title}", "${body}", "${deadline}", ${userId})
  `)
  const doodleId = (result as ResultSetHeader).insertId

  let resultInsert
  if (tags) {
    const tagInserts = tags.split(",").map(id => `(${doodleId},${id})`);
    
    [resultInsert, ] = await pool.execute(`
      INSERT INTO tag_doodle_mtm (doodle_id, tag_id)
      VALUES ${tagInserts.toString()}
  `)}

  console.warn("create result: ", result)
  return doodleId
}

export async function deleteDoodle(doodleId: string): Promise<boolean> {
  const [result, ] = await pool.execute(`
    DELETE FROM doodle WHERE id=${doodleId};
  `)

  console.warn("delete doodle res: ", !!result)
  return !!result
}


export async function updateDoodle(doodleId: string, title: string, body: string, deadline: string, tags?: string): Promise<boolean> {
  const [resultMain, ] = await pool.execute(`
    UPDATE doodle
    SET title="${title}", body="${body}", deadline="${deadline}"
    WHERE id=${doodleId}
  `)

  const [resultDelete, ] = await pool.execute(`
    DELETE FROM tag_doodle_mtm WHERE doodle_id=${doodleId}
  `)

  let resultInsert
  if (tags) {
    const tagInserts = tags.split(",").map(id => `(${doodleId},${id})`);
    
    [resultInsert, ] = await pool.execute(`
      INSERT INTO tag_doodle_mtm (doodle_id, tag_id)
      VALUES ${tagInserts.toString()}
  `)}

  console.warn("change doodle status res: ", !!resultMain && !!resultDelete && !!resultInsert)
  return !!resultMain && !!resultDelete && !!resultInsert
}

export async function changeDoodleStatus(doodleId: string, newStatus: string): Promise<boolean> {
  const currDate = new Date()
  const [result, ] = await pool.execute(`
    UPDATE doodle
    SET status=${newStatus}
      , completed=${newStatus == "1" ? `"${currDate.toLocaleDateString("ja")}"` : "NULL"}
    WHERE id=${doodleId}
  `)

  console.warn("change doodle status res: ", !!result)
  return !!result
}

export default router;