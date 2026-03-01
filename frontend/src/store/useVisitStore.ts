import { create } from 'zustand';
import type { Visit, CreateVisitPayload } from '../types';
import { fetchVisits, createVisit } from '../api';

interface VisitState {
    visits: Visit[];
    loading: boolean;
    error: string | null;
    filterClinician: string;
    filterPatient: string;
    fetch: (params?: { clinicianId?: string; patientId?: string }) => Promise<void>;
    add: (data: CreateVisitPayload) => Promise<void>;
    setFilterClinician: (id: string) => void;
    setFilterPatient: (id: string) => void;
    clearFilters: () => void;
}

export const useVisitStore = create<VisitState>((set, get) => ({
    visits: [],
    loading: false,
    error: null,
    filterClinician: '',
    filterPatient: '',

    fetch: async (params) => {
        if (!params && get().visits.length > 0 && !get().error) return;
        set({ loading: true, error: null });
        try {
            const visits = await fetchVisits(params);
            set({ visits });
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
        const visit = await createVisit(data);
        set((state) => ({ visits: [visit, ...state.visits] }));
    },

    setFilterClinician: (id) => {
        set({ filterClinician: id });
        const { filterPatient } = get();
        get().fetch({ clinicianId: id || undefined, patientId: filterPatient || undefined });
    },

    setFilterPatient: (id) => {
        set({ filterPatient: id });
        const { filterClinician } = get();
        get().fetch({ clinicianId: filterClinician || undefined, patientId: id || undefined });
    },

    clearFilters: () => {
        set({ filterClinician: '', filterPatient: '' });
        get().fetch();
    },
}));
