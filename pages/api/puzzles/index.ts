import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/prisma";
import apiError from "utils/api";
const seedrandom = require("seedrandom");

const MAX_PUZZLES = 5;

export default async function handle(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const localCache: string[] = [];

  const itemCount = await prisma.phrase.count();

  // Pick the same random batch of puzzles given a day
  // 1. Generate 2 random numbers using the day string as a seed
  // 2. Use one number to randomly pick the column to sort by
  // 3. Use the other number to pick a random offset for the DB

  const randomNumberGen = new seedrandom(new Date().toDateString());
  const randomOne = randomNumberGen.quick();
  const randomTwo = randomNumberGen.quick();

  const randomPick = (values: string[]) => {
    const index = Math.floor(randomOne * values.length);
    return values[index];
  };
  const randomNumber = (min: number, max: number) => {
    return Math.floor(randomTwo * (max - min + 1)) + min;
  };

  const orderBy = randomPick(["id", "content"]);

  const results = await prisma.phrase.findMany({
    where: {
      id: { notIn: localCache },
    },
    orderBy: { [orderBy]: "desc" },
    skip: randomNumber(0, itemCount - MAX_PUZZLES),
    include: {
      emojis: {
        select: {
          id: true,
          emoji: true,
        },
      },
    },
    take: MAX_PUZZLES,
  });

  // const random = Math.floor(Math.random() * results.length);

  if (!results) {
    return res.status(404).json(apiError(`No puzzles available`));
  }

  const sortedResults = results.sort((a, b) => {
    if (a.content.length < b.content.length) {
      return -1;
    } else {
      return 1;
    }
  });

  return res.status(200).json(sortedResults.slice(0, MAX_PUZZLES));
}
