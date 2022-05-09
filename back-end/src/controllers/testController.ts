import { Request, Response } from "express";
import { prisma } from "../database.js";

export async function clearRecommendations( _req: Request, res: Response) {
  await prisma.recommendation.deleteMany();

  return res.sendStatus(200);
}