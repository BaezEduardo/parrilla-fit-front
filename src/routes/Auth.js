// routes/auth.js (o similar)
import { Router } from "express";
import { requireAuth } from "./authz.js"; // debe decodificar el JWT y adjuntar req.user
import { findUserById, sanitizeUser } from "../airtable.js"; // ajusta a tus helpers

const r = Router();

r.get("/me", requireAuth, async (req, res) => {
  // req.user.id viene del JWT
  const u = await findUserById(req.user.id);
  if (!u) return res.status(404).json({ error: "No encontrado" });
  res.json(sanitizeUser(u)); // {id,name,phone,role,likes,dislikes,allergies}
});

export default r;
