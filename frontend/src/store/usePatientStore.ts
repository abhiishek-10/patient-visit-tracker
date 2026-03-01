import { create } from 'zustand';
import type { Patient, CreatePatientPayload } from '../types';
import { fetchPatients, createPatient } from '../api';

interface PatientState {
    patients: Patient[];
    loading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
    add: (data: CreatePatientPayload) => Promise<void>;
}

export const usePatientStore = create<PatientState>((set, get) => ({
    patients: [],
    loading: false,
    error: null,

    fetch: async () => {
        if (get().patients.length > 0 && !get().error) return;
        set({ loading: true, error: null });
        try {
            const patients = await fetchPatients();
            set({ patients });
        } catch (e: unknown) {
            if (e instanceof Error) {
                set({ error: e.message });
            } else {
                set({ error: 'An unknown error occurred' });
            }
        } finally {
            set({ loading: false });
        }
    },

    add: async (data) => {
        const patient = await createPatient(data);
        set((state) => ({ patients: [...state.patients, patient].sort((a, b) => a.name.localeCompare(b.name)) }));
    },
}));
