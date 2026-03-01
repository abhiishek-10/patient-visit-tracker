/*
  Warnings:

  - The primary key for the `clinicians` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `patients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `visits` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_clinicianId_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_patientId_fkey";

-- AlterTable
ALTER TABLE "clinicians" DROP CONSTRAINT "clinicians_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "clinicians_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "clinicians_id_seq";

-- AlterTable
ALTER TABLE "patients" DROP CONSTRAINT "patients_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "patients_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "patients_id_seq";

-- AlterTable
ALTER TABLE "visits" DROP CONSTRAINT "visits_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clinicianId" SET DATA TYPE TEXT,
ALTER COLUMN "patientId" SET DATA TYPE TEXT,
ADD CONSTRAINT "visits_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "visits_id_seq";

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_clinicianId_fkey" FOREIGN KEY ("clinicianId") REFERENCES "clinicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
