import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/prisma";
import apiError from "utils/api";
import { PuzzleAttempt } from "@prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const puzzleId = req.query.puzzle_id!!.toString();

  const phrase = await prisma.phrase.findUnique({
    where: {
      id: puzzleId,
    },
    include: {
      emojis: {
        include: {
          userAttempts: {
            where: {
              success: 1,
            },
          },
        },
      },
    },
  });
  if (!phrase) {
    return res.status(404).json(apiError(`Not found`));
  }

  const bestAttemptsByUser = new Map<string, PuzzleAttempt>();
  // Pad all stats with two successes: one took two tries, the other took three tries.
  // - each character takes 0.5-1.5 seconds
  const numChars = phrase.content.replace(/[^a-zA-Z]/g, "").length;
  const twoTriesTime = Math.floor((Math.random() + 0.5) * numChars * 2);
  const threeTriesTime = Math.floor((Math.random() + 0.5) * numChars * 3);

  let minTime = Math.min(twoTriesTime, threeTriesTime);
  let maxTime = Math.max(twoTriesTime, threeTriesTime);
  for (const em of phrase.emojis) {
    for (const at of em.userAttempts) {
      const bestAttempt = bestAttemptsByUser.get(at.playerId)!;
      if (bestAttempt === undefined) {
        bestAttemptsByUser.set(at.playerId, at);
      } else {
        // order is the number of tries the user took (0-indexed so order = 0 means 1 try).
        if (at.order < bestAttempt.order) {
          bestAttemptsByUser.set(at.playerId, at);
        }
      }

      if (at.duration < minTime || minTime == 0) {
        minTime = at.duration;
      }
      if (at.duration > maxTime) {
        maxTime = at.duration;
      }
    }
  }

  let aggregateAttempts: number[] = [...new Array(5)].map(() => 0);
  // Pad all stats with two successes: one took two tries, the other took three tries.
  aggregateAttempts[1] += 1;
  aggregateAttempts[2] += 1;
  bestAttemptsByUser.forEach((bestAttempt) => {
    aggregateAttempts[bestAttempt.order] += 1;
  });

  return res.status(200).json({
    puzzle: {
      id: phrase.id,
      stats: { successAttempts: aggregateAttempts, minTime, maxTime },
    },
  });
}
