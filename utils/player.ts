import { Player } from "@prisma/client";
import axios from "axios";
import Cookie from "cookies";
import { IncomingMessage, ServerResponse } from "http";

export const getPlayerId = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["host"];
  const baseUrl = `${protocol}://${host}`;

  const cookies = Cookie(req, res);
  const playerId = cookies.get("playerId");
  if (playerId) return playerId;

  const playerResponse = await axios.post(`${baseUrl}/api/players`, {
    token: new Date().toISOString(),
  });
  const player: Player = playerResponse.data;
  cookies.set("playerId", player.id);
  return player.id;
};
