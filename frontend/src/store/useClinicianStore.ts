import { create } from 'zustand';
import type { Clinician, CreateClinicianPayload } from '../types';
import { fetchClinicians, createClinician } from '../api';

interface ClinicianState {
    clinicians: Clinician[];
    loading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
    add: (data: CreateClinicianPayload) => Promise<void>;
}

export const useClinicianStore = create<ClinicianState>((set, get) => ({
    clinicians: [],
    loading: false,
    error: null,

    fetch: async () => {
        if (get().clinicians.length > 0 && !get().error) return;
        set({ loading: true, error: null });
        try {
            const clinicians = await fetchClinicians();
            set({ clinicians });
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
        const clinician = await createClinician(data);
        set((state) => ({ clinicians: [...state.clinicians, clinician].sort((a, b) => a.name.localeCompare(b.name)) }));
    },
}));
