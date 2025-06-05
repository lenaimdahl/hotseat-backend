import express from "express";
import Lobby from "../models/Lobby";

const router = express.Router();

const generateCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

// sending a lobby with a get request to frontend
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

// to create a new lobby, save it to the database, then send the code back to the frontend
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

// to join a lobby, save the user to the lobby in the database
router.post("/lobby/:code/join", async (req, res) => {
  try {
    const { username } = req.body;
    const lobbyCode = req.params.code.toUpperCase();

    const lobby = await Lobby.findOne({ code: lobbyCode });
    if (!lobby) {
      res.status(404).json({ message: "Lobby not found" });
      return;
    }

    let userId: string;
    let exists: Boolean;
    do {
      userId = generateCode();
      exists = lobby.users.some((user) => user.userId === userId);
    } while (exists);
    const newUser = { userId, username, points: 0 };

    lobby.users.push(newUser);
    await lobby.save();

    res.status(201).json({ user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
