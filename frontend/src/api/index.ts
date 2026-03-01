import type {
  Clinician,
  Patient,
  Visit,
  CreateVisitPayload,
  CreateClinicianPayload,
  CreatePatientPayload,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL as string;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Clinicians
export const fetchClinicians = () => request<Clinician[]>('/clinicians');
export const createClinician = (data: CreateClinicianPayload) =>
  request<Clinician>('/clinicians', { method: 'POST', body: JSON.stringify(data) });

// Patients
export const fetchPatients = () => request<Patient[]>('/patients');
export const createPatient = (data: CreatePatientPayload) =>
  request<Patient>('/patients', { method: 'POST', body: JSON.stringify(data) });

// Visits
export const fetchVisits = (params?: { clinicianId?: string; patientId?: string }) => {
  const qs = new URLSearchParams();
  if (params?.clinicianId) qs.set('clinicianId', String(params.clinicianId));
  if (params?.patientId) qs.set('patientId', String(params.patientId));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<Visit[]>(`/visits${query}`);
};
export const createVisit = (data: CreateVisitPayload) =>
  request<Visit>('/visits', { method: 'POST', body: JSON.stringify(data) });
