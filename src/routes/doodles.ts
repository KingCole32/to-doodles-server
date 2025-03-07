import { Router } from "express";
import { changeDoodleStatus, countDoodles, createDoodle, deleteDoodle, getDoodles, updateDoodle } from "../services/doodles";

const router = Router();

router.get('/get/:userId/:page/:offset/:status/:tags?', async (req, res, next) => {
  const { userId, page, offset, status, tags } = req.params
  try {
    res.json(await getDoodles(userId, page, offset, status, tags))
  } catch (err) {
      next(err)
  }
});

router.get('/count/:userId/:status/:tags?', async (req, res, next) => {
  console.log("get total doods: ", req.params)
  const { userId, status, tags } = req.params
  try {
    res.json(await countDoodles(userId, status, tags))
  } catch (err) {
    next(err)
  }
})

router.put('/create', async (req, res, next) => {
  console.warn("create doods body: ", req.body)
  const { title, body, deadline, userId, tags } = req.body
  try {
      res.json(await createDoodle(title, body, deadline, userId, tags))
  } catch (err) {
    next(err)
  }
});

router.delete('/delete', async (req, res, next) => {
  console.warn("delete body: ", req.body)
  const { doodleId } = req.body
  try {
    res.json(await deleteDoodle(doodleId))
  } catch (err) {
    next(err)
  }
})

router.put('/update', async (req, res, next) => {
  console.log("update doodle ", req.body)
  const { doodleId, title,  body, deadline, tags } = req.body
  try {
      res.json(await updateDoodle(doodleId, title,  body, deadline, tags))
  } catch (err) {
    next(err)
  }
})

router.put('/change_status', async (req, res, next) => {
  console.log("change status of doodle ", req.params)
  const { doodleId, newStatus } = req.body
  try {
      res.json(await changeDoodleStatus(doodleId, newStatus))
  } catch (err) {
    next(err)
  }
})

export default router;