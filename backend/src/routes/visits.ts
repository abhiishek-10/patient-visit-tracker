import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/visits?clinicianId=&patientId=
router.get('/', async (req: Request, res: Response) => {
  try {
    const { clinicianId, patientId } = req.query;

    const where: Record<string, unknown> = {};
    if (clinicianId) where.clinicianId = clinicianId as string;
    if (patientId) where.patientId = patientId as string;

    const visits = await prisma.visit.findMany({
      where,
      orderBy: { visitedAt: 'desc' },
      include: {
        clinician: { select: { id: true, name: true, specialty: true } },
        patient: { select: { id: true, name: true, dateOfBirth: true } },
      },
    });
    res.json(visits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

// GET /api/visits/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        clinician: { select: { id: true, name: true, specialty: true } },
        patient: { select: { id: true, name: true, dateOfBirth: true } },
      },
    });
    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' });
    }
    res.json(visit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch visit' });
  }
});

// POST /api/visits
router.post('/', async (req: Request, res: Response) => {
  try {
    const { clinicianId, patientId, visitedAt, notes } = req.body as {
      clinicianId: string;
      patientId: string;
      visitedAt?: string;
      notes?: string;
    };

    if (!clinicianId || !patientId) {
      return res.status(400).json({ error: 'clinicianId and patientId are required' });
    }

    // Verify clinician and patient exist
    const [clinician, patient] = await Promise.all([
      prisma.clinician.findUnique({ where: { id: clinicianId } }),
      prisma.patient.findUnique({ where: { id: patientId } }),
    ]);

    if (!clinician) return res.status(404).json({ error: 'Clinician not found' });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const visit = await prisma.visit.create({
      data: {
        clinicianId,
        patientId,
        visitedAt: visitedAt ? new Date(visitedAt) : new Date(),
        notes: notes || null,
      },
      include: {
        clinician: { select: { id: true, name: true, specialty: true } },
        patient: { select: { id: true, name: true, dateOfBirth: true } },
      },
    });
    res.status(201).json(visit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create visit' });
  }
});

export default router;
