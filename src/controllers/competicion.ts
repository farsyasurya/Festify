import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthRequest } from "../midleware/auth";
import path from "path";

const prisma = new PrismaClient();



export async function getCompetitionByAdmin(req: AuthRequest, res: Response) {
  try {
  
    const adminId = req.user.id;

   
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Hanya admin yang bisa mengakses data ini" });
    }

 
    const competitions = await prisma.competition.findMany({
      where: { createdById: adminId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        materialUrl: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        participants: {
          select: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

   
    if (competitions.length === 0) {
      return res.status(404).json({ message: "Belum ada lomba yang dibuat admin ini" });
    }

    res.json({
      message: "Daftar lomba milik admin",
      data: competitions,
    });
  } catch (error) {
    console.error("Error getCompetitionByAdmin:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

export async function addCompeticion(req: AuthRequest, res: Response) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Hanya admin yang bisa menambahkan kompetisi" });
    }

    const { title, description, startTime, endTime } = req.body;

    if (!title || !description || !startTime || !endTime) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Cek apakah nama lomba sudah ada
    const existingCompetition = await prisma.competition.findFirst({
      where: { title },
    });

    if (existingCompetition) {
      return res.status(400).json({
        message: `Kompetisi dengan nama "${title}" sudah terdaftar.`,
      });
    }

    // Upload file PDF (opsional)
    const materialUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Buat kompetisi baru
    const newCompetition = await prisma.competition.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        materialUrl,
        createdById: req.user.id,
      },
    });

    res.status(201).json({
      message: "Kompetisi berhasil dibuat",
      data: newCompetition,
    });
  } catch (error) {
    console.error("Error addCompeticion:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

export async function updateCompetition(req: AuthRequest, res: Response) {
  try {
    
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Hanya admin yang bisa mengedit kompetisi" });
    }

    const { id } = req.params;
    const { title, description, startTime, endTime } = req.body;

    
    const competition = await prisma.competition.findUnique({
      where: { id: Number(id) },
    });

    if (!competition) {
      return res.status(404).json({ message: "Kompetisi tidak ditemukan" });
    }

    if (competition.createdById !== req.user.id) {
      return res.status(403).json({ message: "Anda tidak memiliki akses ke kompetisi ini" });
    }


    let materialUrl = competition.materialUrl;
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext !== ".pdf") {
        return res.status(400).json({ message: "Hanya file PDF yang diperbolehkan" });
      }

      materialUrl = `/uploads/${req.file.filename}`;
    }

   
    const updated = await prisma.competition.update({
      where: { id: Number(id) },
      data: {
        title: title || competition.title,
        description: description || competition.description,
        startTime: startTime ? new Date(startTime) : competition.startTime,
        endTime: endTime ? new Date(endTime) : competition.endTime,
        materialUrl,
      },
    });

    res.json({
      message: "Kompetisi berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("Error updateCompetition:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

export async function deleteCompetition(req: AuthRequest, res: Response)  {
    try {
           if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Hanya admin yang bisa mengedit kompetisi" });
    }

    const { id } = req.params;
    const delete_competition = await prisma.competition.delete({ where: { id: Number(id) }})

    res.status(200).json({
    message: "Kompetisi berhasil dihapus",
    data: delete_competition,
    });

    } catch (error) {
     res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}

export async function getMyCompetition(req: AuthRequest, res: Response) {
  try {
    // pastikan user sudah login
    if (!req.user || req.user.role !== "USER") {
      return res.status(403).json({ message: "Hanya peserta yang bisa melihat lomba yang diikuti" });
    }

    const userId = req.user.id;

    // cari semua lomba yang diikuti oleh user ini
    const joinedCompetitions = await prisma.competitionParticipant.findMany({
      where: { userId },
      select: {
        competition: {
          select: {
            id: true,
            title: true,
            description: true,
            startTime: true,
            endTime: true,
            materialUrl: true,
            createdBy: { select: { id: true, name: true, email: true } },
          },
        },
        joinedAt: true, // jika kamu punya kolom ini di participant
      },
    });

    if (joinedCompetitions.length === 0) {
      return res.status(404).json({ message: "Kamu belum mengikuti lomba apapun" });
    }

    // ambil hanya data lombanya
    const competitions = joinedCompetitions.map((p) => ({
      ...p.competition,
      joinedAt: p.joinedAt,
    }));

    res.json({
      message: "Daftar lomba yang kamu ikuti",
      data: competitions,
    });
  } catch (error) {
    console.error("Error getMyCompetition:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}