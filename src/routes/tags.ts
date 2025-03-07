import { Router } from "express";
import { createTag, deleteTag, getTags, updateTag } from "../services/tags";

const router = Router();

router.get('/get/:userId', async (req, res, next) => {
  console.log("get tags: ", req.params)
  try {
    res.json(await getTags(req.params.userId))
  } catch (err) {
    next(err)
  }
})

router.put('/create', async (req, res, next) => {
  try {
      const { userId, name } = req.body
      console.warn("create tag body: ", req.body)
      res.json(await createTag(userId, name))
  } catch (err) {
    next(err)
  }
});

router.put('/update', async (req, res, next) => {
  try {
      const { tagId, name } = req.body
      console.warn("create tag body: ", req.body)
      res.json(await updateTag(tagId, name))
  } catch (err) {
    next(err)
  }
});

router.delete('/delete', async (req, res, next) => {
  console.warn("delete body: ", req.body)
  const { tagId } = req.body
  try {
    res.json(await deleteTag(tagId))
  } catch (err) {
    next(err)
  }
})

export default router;
