import { Router } from "express";
import { loginUser, signupUser } from "../services/auth";

const router = Router();

router.get('/login', async (req, res, next) => {
  try {
    const authorization = req.headers.authorization
    if (!authorization) {
      next(new Error("No credentials in request"))
    }  else {
      const [email, password]: string[] = Buffer.from(authorization.split(" ")[1], 'base64').toString().split(":");
      res.json(await loginUser(email, password))
    }
  } catch (err) {
      next(err)
  }
});

router.put('/signup', async (req, res, next) => {
  try {
      console.warn("body: ", req.body)
      const { name, email, pass } = req.body
      console.warn("params: ", name, email, pass)
      if (!name || !email || !pass) next(new Error("Missing parameters"))
      res.json(await signupUser(name, email, pass))
  } catch (err) {
    next(err)
  }
});

export default router;
