import mongoose, { Schema, Document } from "mongoose";

export interface Lobby extends Document {
  code: string;
  users: Array<{ userId: string; username: string; points: number }>;
  createdAt: Date;
}

const LobbySchema = new Schema<Lobby>({
  code: { type: String, required: true, unique: true },
  users: [
    {
      userId: { type: String, required: true },
      username: { type: String, required: true },
      points: { type: Number, default: 0 },
    },
  ],
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

LobbySchema.pre("save", function (next) {
  this.code = this.code.toUpperCase();
  next();
});

export default mongoose.model<Lobby>("Lobby", LobbySchema);
