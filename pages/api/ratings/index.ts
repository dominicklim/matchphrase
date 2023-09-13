import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/prisma";
import apiError from "utils/api";

interface CreateRating {
  playerId: string;
  puzzleId: string;
  score: number;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(500).json(apiError(`not post`));
  }

  const { playerId, puzzleId, score } = req.body as CreateRating;
  if (!score || !puzzleId || !playerId) {
    return res.status(400).json(apiError(`Invalid data`));
  }

  const player = await prisma.player.findUnique({ where: { id: playerId } });

  const puzzle = await prisma.emojiPuzzle.findUnique({
    where: { id: puzzleId },
  });

  if (!player || !puzzle) {
    return res.status(500).json({ error: `Puzzle or Player not found` });
  }

  const logAttempt = await prisma.puzzleRating.create({
    data: {
      score: score,
      playerId: player.id,
      puzzleId: puzzle.id,
    },
  });

  return res.status(200).json(logAttempt);
}
