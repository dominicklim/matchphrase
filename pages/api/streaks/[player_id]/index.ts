import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const playerId = req.query.player_id!!.toString();

  const attempts = await prisma.puzzleAttempt.findMany({
    where: {
      playerId: playerId,
    },
    orderBy: {
      id: "desc",
    },
  });

  let streak = 0;
  if (!attempts || attempts.length === 0) {
    return res.status(200).json({ streak });
  }

  let puzzleId = attempts[0].puzzleId;
  for (const attempt of attempts) {
    if (
      (attempt.puzzleId !== puzzleId || attempt.order == 4) &&
      attempt.success !== 1
    ) {
      return res.status(200).json({ streak });
    }
    if (attempt.success) {
      streak += 1;
    }
    puzzleId = attempt.puzzleId;
  }

  return res.status(200).json({ streak });
}
