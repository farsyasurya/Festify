import { Request, Response } from "express";
import {  PrismaClient } from "@prisma/client";
import { AuthRequest } from "../midleware/auth";

const prisma = new PrismaClient();

export async function getParticipant(req: AuthRequest, res: Response) {
   
}



export async function joinCompetitionByName(req: AuthRequest, res: Response) {
  try {
    const userId = req.user.id;
    const { competitionName } = req.body;

    if (!competitionName) {
      return res.status(400).json({ message: "competitionName is required" });
    }

    // cari lomba berdasarkan nama
    const competition = await prisma.competition.findFirst({
      where: { title: competitionName },
    });

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // cek apakah user sudah ikut lomba ini
    const existing = await prisma.competitionParticipant.findFirst({
      where: { userId, competitionId: competition.id },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already joined this competition" });
    }

    // buat data peserta baru
    const participant = await prisma.competitionParticipant.create({
      data: {
        userId,
        competitionId: competition.id,
      },
      include: {
        competition: true,
      },
    });

    res.status(201).json({
      message: `Successfully joined ${competition.title}`,
      data: participant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
