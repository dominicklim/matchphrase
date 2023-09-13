import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import prisma from "utils/prisma";
import apiError from "utils/api";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(404).json(apiError(`error`));
  }

  if (!req.body.token) {
    return res.status(400).json(apiError(`Invalid token`));
  }

  const newPlayer = await prisma.player.create({
    data: {
      token: uuidv4(),
    },
  });

  return res.status(200).json({ id: newPlayer.id });
}
