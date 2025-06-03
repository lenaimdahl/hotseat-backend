import express from "express";
import Lobby from "../models/Lobby";

const router = express.Router();

const generateCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

router.get("/lobby/:code", async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const lobby = await Lobby.findOne({ code });

    if (!lobby) {
      res.status(404).json({ error: "Lobby not found" });
      return;
    }

    res.json(lobby);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/lobby", async (req, res) => {
  try {
    let code: string;
    let exists: boolean;
    do {
      code = generateCode();
      exists = (await Lobby.exists({ code })) !== null;
    } while (exists);
    const lobby = new Lobby({ code });
    await lobby.save();

    res.status(201).json({ code });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Lobby code already exists" });
      return;
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
