import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const puzzleId = req.query.puzzle_id!!.toString();

  const puzzle = await prisma.phrase.findUnique({
    where: {
      id: puzzleId,
    },
    include: {
      emojis: {
        select: {
          id: true,
          emoji: true,
        },
      },
    },
  });

  if (!puzzle) {
    return res.status(404).json({ error: `Not found` });
  }

  return res.status(200).json(puzzle);
}
