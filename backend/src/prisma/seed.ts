import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create clinicians
    const clinicians = await Promise.all([
        prisma.clinician.upsert({
            where: { email: 'dr.smith@clinic.com' },
            update: {},
            create: {
                name: 'Dr. Emily Smith',
                specialty: 'General Practice',
                email: 'dr.smith@clinic.com',
            },
        }),
        prisma.clinician.upsert({
            where: { email: 'dr.jones@clinic.com' },
            update: {},
            create: {
                name: 'Dr. Michael Jones',
                specialty: 'Cardiology',
                email: 'dr.jones@clinic.com',
            },
        }),
        prisma.clinician.upsert({
            where: { email: 'dr.patel@clinic.com' },
            update: {},
            create: {
                name: 'Dr. Priya Patel',
                specialty: 'Pediatrics',
                email: 'dr.patel@clinic.com',
            },
        }),
        prisma.clinician.upsert({
            where: { email: 'dr.johnson@clinic.com' },
            update: {},
            create: {
                name: 'Dr. Sarah Johnson',
                specialty: 'Neurology',
                email: 'dr.johnson@clinic.com',
            },
        }),
        prisma.clinician.upsert({
            where: { email: 'dr.lee@clinic.com' },
            update: {},
            create: {
                name: 'Dr. David Lee',
                specialty: 'Orthopedics',
                email: 'dr.lee@clinic.com',
            },
        }),
    ]);

    console.log(`Created ${clinicians.length} clinicians`);

    // Create patients
    const patients = await Promise.all([
        prisma.patient.upsert({
            where: { email: 'alice.brown@example.com' },
            update: {},
            create: {
                name: 'Alice Brown',
                dateOfBirth: new Date('1985-03-12'),
                email: 'alice.brown@example.com',
                phone: '555-0101',
            },
        }),
        prisma.patient.upsert({
            where: { email: 'bob.wilson@example.com' },
            update: {},
            create: {
                name: 'Bob Wilson',
                dateOfBirth: new Date('1972-07-25'),
                email: 'bob.wilson@example.com',
                phone: '555-0102',
            },
        }),
        prisma.patient.upsert({
            where: { email: 'carol.taylor@example.com' },
            update: {},
            create: {
                name: 'Carol Taylor',
                dateOfBirth: new Date('1990-11-08'),
                email: 'carol.taylor@example.com',
                phone: '555-0103',
            },
        }),
        prisma.patient.upsert({
            where: { email: 'david.martin@example.com' },
            update: {},
            create: {
                name: 'David Martin',
                dateOfBirth: new Date('1968-01-30'),
                email: 'david.martin@example.com',
                phone: '555-0104',
            },
        }),
        prisma.patient.upsert({
            where: { email: 'eva.garcia@example.com' },
            update: {},
            create: {
                name: 'Eva Garcia',
                dateOfBirth: new Date('1995-06-14'),
                email: 'eva.garcia@example.com',
                phone: '555-0105',
            },
        }),
        prisma.patient.upsert({
            where: { email: 'frank.anderson@example.com' },
            update: {},
            create: {
                name: 'Frank Anderson',
                dateOfBirth: new Date('1980-09-22'),
                email: 'frank.anderson@example.com',
                phone: '555-0106',
            },
        }),
        prisma.patient.upsert({
            where: { email: 'grace.thomas@example.com' },
            update: {},
            create: {
                name: 'Grace Thomas',
                dateOfBirth: new Date('2005-02-17'),
                email: 'grace.thomas@example.com',
                phone: '555-0107',
            },
        }),
        prisma.patient.upsert({
            where: { email: 'henry.clark@example.com' },
            update: {},
            create: {
                name: 'Henry Clark',
                dateOfBirth: new Date('1955-12-05'),
                email: 'henry.clark@example.com',
                phone: '555-0108',
            },
        }),
    ]);

    console.log(`Created ${patients.length} patients`);

    // Create some initial visits
    const now = new Date();
    const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

    const visits = await Promise.all([
        prisma.visit.create({
            data: {
                clinicianId: clinicians[0].id,
                patientId: patients[0].id,
                visitedAt: daysAgo(10),
                notes: 'Routine annual checkup. Patient in good health.',
            },
        }),
        prisma.visit.create({
            data: {
                clinicianId: clinicians[1].id,
                patientId: patients[1].id,
                visitedAt: daysAgo(8),
                notes: 'Follow-up on blood pressure medication.',
            },
        }),
        prisma.visit.create({
            data: {
                clinicianId: clinicians[2].id,
                patientId: patients[6].id,
                visitedAt: daysAgo(7),
                notes: 'Annual pediatric wellness exam.',
            },
        }),
        prisma.visit.create({
            data: {
                clinicianId: clinicians[0].id,
                patientId: patients[2].id,
                visitedAt: daysAgo(5),
                notes: 'Patient reported persistent headaches. Referred to neurology.',
            },
        }),
        prisma.visit.create({
            data: {
                clinicianId: clinicians[3].id,
                patientId: patients[3].id,
                visitedAt: daysAgo(4),
                notes: 'Initial consultation for migraines.',
            },
        }),
        prisma.visit.create({
            data: {
                clinicianId: clinicians[4].id,
                patientId: patients[5].id,
                visitedAt: daysAgo(3),
                notes: 'Post-surgery knee follow-up. Recovery progressing well.',
            },
        }),
        prisma.visit.create({
            data: {
                clinicianId: clinicians[1].id,
                patientId: patients[7].id,
                visitedAt: daysAgo(2),
                notes: 'Cardiac stress test review.',
            },
        }),
        prisma.visit.create({
            data: {
                clinicianId: clinicians[0].id,
                patientId: patients[4].id,
                visitedAt: daysAgo(1),
                notes: null,
            },
        }),
    ]);

    console.log(`Created ${visits.length} visits`);
    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
