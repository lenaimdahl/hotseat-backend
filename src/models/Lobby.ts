import mongoose, { Schema, Document } from "mongoose";

export interface Lobby extends Document {
  code: string;
  createdAt: Date;
}

const LobbySchema = new Schema<Lobby>({
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

LobbySchema.pre("save", function (next) {
  this.code = this.code.toUpperCase();
  next();
});

export default mongoose.model<Lobby>("Lobby", LobbySchema);
