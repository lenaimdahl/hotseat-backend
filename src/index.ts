import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import lobbyRouter from "./routes/lobby.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", lobbyRouter);

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hallo von HotSeat-Backend!" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Verbunden mit MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Fehler bei MongoDB-Verbindung:", err);
  });
