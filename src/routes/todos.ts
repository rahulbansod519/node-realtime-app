import { Router } from "express";
import db from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const result = await db.query(
    "SELECT id, title, done FROM todos ORDER BY id"
  );
  res.json(result.rows);
});

router.post("/", async (req, res) => {
  const { title } = req.body;
  const result = await db.query(
    "INSERT INTO todos (title, done) VALUES ($1, false) RETURNING *",
    [title]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  const result = await db.query(
    "UPDATE todos SET done=$1 WHERE id=$2 RETURNING *",
    [done, id]
  );
  res.json(result.rows[0]);
});

// DELETE a todo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM todos WHERE id=$1", [id]);
  res.sendStatus(204);
});

export default router;