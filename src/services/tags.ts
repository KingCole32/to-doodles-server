import { Router, Request, Response } from "express";
import pool from "./db";
import { Tag } from "../types";
import { ResultSetHeader } from "mysql2";

export async function getTags(userId: string): Promise<Array<Tag>> {
  const [result, ] = await pool.execute(`
    SELECT id, tag_name
    FROM doodle_tag
    WHERE user_id = ${userId}
  `)

  console.log("LOG: get tags success with res ", result)
  return (result as Array<Tag>)
}

export async function createTag(userId: string, name: string): Promise<number> {
  const [result, ] = await pool.execute(`
    INSERT INTO doodle_tag (tag_name, user_id)
    VALUE ("${name}", ${userId})
  `)

  console.warn("create tag result: ", result)
  return (result as ResultSetHeader).insertId
}

export async function deleteTag(tagId: string): Promise<boolean> {
  const [result, ] = await pool.execute(`
    DELETE FROM doodle_tag WHERE id=${tagId};
  `)

  console.warn("delete tag res: ", !!result)
  return !!result
}

export async function updateTag(tagId: string, newName: string): Promise<boolean> {
  const [result, ] = await pool.execute(`
    UPDATE doodle_tag
    SET tag_name="${newName}"
    WHERE id=${tagId}
  `)

  console.warn("change tag name res: ", result != undefined)
  return result != undefined
}