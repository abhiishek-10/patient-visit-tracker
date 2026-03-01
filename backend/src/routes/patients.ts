import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/patients
router.get('/', async (_req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { visits: true } },
      },
    });
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// GET /api/patients/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        _count: { select: { visits: true } },
      },
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// POST /api/patients
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, dateOfBirth, email, phone } = req.body as {
      name: string;
      dateOfBirth: string;
      email?: string;
      phone?: string;
    };

    if (!name || !dateOfBirth) {
      return res.status(400).json({ error: 'name and dateOfBirth are required' });
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        dateOfBirth: new Date(dateOfBirth),
        email: email || null,
        phone: phone || null,
      },
    });
    res.status(201).json(patient);
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(409).json({ error: 'A patient with this email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

export default router;
