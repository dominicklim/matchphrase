import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/prisma";
import apiError from "utils/api";

interface CreateAttempt {
  userInput: string;
  puzzleId: string; // not used
  emojiId: string;
  playerId: string;
  duration: number;
  success: number;
  order: number;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(404).json(apiError(`Invalid request`));
  }

  const { userInput, emojiId, playerId, duration, success, order } =
    req.body as CreateAttempt;
  if (!userInput || !emojiId || !duration || !playerId) {
    return res.status(400).json(apiError(`Invalid data`));
  }

  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
  });

  if (!player) {
    return res.status(500).json(apiError(`Player not found`));
  }

  const logAttempt = await prisma.puzzleAttempt.create({
    data: {
      puzzleId: emojiId,
      userInput: userInput,
      duration: Math.max(duration, 1),
      order: order,
      playerId: player.id,
      success: success,
    },
  });

  return res.status(200).json(logAttempt);
}
