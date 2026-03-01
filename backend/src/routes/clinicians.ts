import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/clinicians
router.get('/', async (_req: Request, res: Response) => {
  try {
    const clinicians = await prisma.clinician.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { visits: true } },
      },
    });
    res.json(clinicians);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clinicians' });
  }
});

// GET /api/clinicians/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clinician = await prisma.clinician.findUnique({
      where: { id },
      include: {
        _count: { select: { visits: true } },
      },
    });
    if (!clinician) {
      return res.status(404).json({ error: 'Clinician not found' });
    }
    res.json(clinician);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clinician' });
  }
});

// POST /api/clinicians
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, specialty, email } = req.body as {
      name: string;
      specialty: string;
      email: string;
    };

    if (!name || !specialty || !email) {
      return res.status(400).json({ error: 'name, specialty, and email are required' });
    }

    const clinician = await prisma.clinician.create({
      data: { name, specialty, email },
    });
    res.status(201).json(clinician);
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(409).json({ error: 'A clinician with this email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create clinician' });
  }
});

export default router;
