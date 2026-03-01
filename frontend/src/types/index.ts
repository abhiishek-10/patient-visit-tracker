export interface Clinician {
  id: string;
  name: string;
  specialty: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  _count?: { visits: number };
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  email?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { visits: number };
}

export interface Visit {
  id: string;
  clinicianId: string;
  patientId: string;
  visitedAt: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  clinician: Pick<Clinician, 'id' | 'name' | 'specialty'>;
  patient: Pick<Patient, 'id' | 'name' | 'dateOfBirth'>;
}

export interface CreateVisitPayload {
  clinicianId: string;
  patientId: string;
  visitedAt?: string;
  notes?: string;
}

export interface CreateClinicianPayload {
  name: string;
  specialty: string;
  email: string;
}

export interface CreatePatientPayload {
  name: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
}
