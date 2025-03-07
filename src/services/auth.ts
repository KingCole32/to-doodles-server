import { Router, Request, Response } from "express";
import pool from "./db"
import { ResultSetHeader } from "mysql2";
import { DoodleUser } from "../types";

/**
 * simple login with password hashing (out of curiousity), but otherwise only base security
 * @param name 
 * @param pass 
 * @returns DoodleUser 
 */
export async function loginUser(email: string, pass: string): Promise<any> {
  const [result, ] = await pool.execute(
    'SELECT id, username, email ' +
    'FROM doodle_user ' + 
    `WHERE email = "${email}" AND password = "${pass}"`
  );

  if (!result) throw new Error("No user found")
  else {
    console.log("LOG: User signin success with res ", result)
    return result
  }
};

export async function signupUser(name: string, email: string, pass: string): Promise<number> {
  console.warn("signup user")
  const [result, ] = await pool.execute(
    'INSERT INTO doodle_user (username, email, password) ' +
    'VALUES (?, ?, ?)',
    [name, email, pass]
  );

  console.log("signup result: ", result);
  return (result as ResultSetHeader).insertId
}