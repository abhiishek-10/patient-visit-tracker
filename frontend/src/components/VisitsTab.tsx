import { useState, useEffect } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { useVisitStore } from '../store/useVisitStore';
import { useClinicianStore } from '../store/useClinicianStore';
import { usePatientStore } from '../store/usePatientStore';
import SearchableSelect from './SearchableSelect';

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function VisitsTab() {
  const { visits, loading, error, filterClinician, filterPatient, fetch, add, setFilterClinician, setFilterPatient, clearFilters } = useVisitStore();
  const { clinicians, fetch: fetchClinicians } = useClinicianStore();
  const { patients, fetch: fetchPatients } = usePatientStore();

  // New visit form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clinicianId: '', patientId: '', visitedAt: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetch();
    fetchClinicians();
    fetchPatients();
  }, [fetch, fetchClinicians, fetchPatients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await add({
        clinicianId: form.clinicianId,
        patientId: form.patientId,
        visitedAt: form.visitedAt || undefined,
        notes: form.notes || undefined,
      });
      setForm({ clinicianId: '', patientId: '', visitedAt: '', notes: '' });
      setShowForm(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setFormError(e.message);
      } else {
        setFormError('An unknown error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const hasFilters = filterClinician || filterPatient;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visits</h2>
          <p className="text-sm text-gray-500 mt-1">{visits.length} visit{visits.length !== 1 ? 's' : ''}{hasFilters ? ' (filtered)' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Record Visit
        </button>
      </div>

      {/* New Visit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Record New Visit</h3>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{formError}</div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Clinician *</label>
              <SearchableSelect
                required
                value={form.clinicianId}
                onChange={(val) => setForm({ ...form, clinicianId: val })}
                placeholder="Search clinicians…"
                options={clinicians.map((c) => ({ value: c.id, label: c.name, sublabel: c.specialty }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Patient *</label>
              <SearchableSelect
                required
                value={form.patientId}
                onChange={(val) => setForm({ ...form, patientId: val })}
                placeholder="Search patients…"
                options={patients.map((p) => ({ value: p.id, label: p.name }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Visit Date & Time</label>
              <input
                type="datetime-local"
                value={form.visitedAt}
                onChange={(e) => setForm({ ...form, visitedAt: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank to use current time</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional visit notes…"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Saving…' : 'Record Visit'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null); }}
                className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-40">
            <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Clinician</label>
            <SearchableSelect
              options={clinicians.map((c) => ({ value: c.id, label: c.name, sublabel: c.specialty }))}
              value={filterClinician}
              onChange={setFilterClinician}
              placeholder="All clinicians"
            />
          </div>
          <div className="flex-1 min-w-40">
            <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Patient</label>
            <SearchableSelect
              options={patients.map((p) => ({ value: p.id, label: p.name }))}
              value={filterPatient}
              onChange={setFilterPatient}
              placeholder="All patients"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Visits Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      ) : visits.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">{hasFilters ? 'No visits match your filters' : 'No visits recorded yet'}</p>
          <p className="text-sm mt-1">{hasFilters ? 'Try clearing the filters' : 'Record a visit to get started'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clinician</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatDate(v.visitedAt)}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900">{v.patient.name}</td>
                  <td className="px-5 py-3.5 text-gray-700">{v.clinician.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {v.clinician.specialty}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 max-w-xs">
                    {v.notes ? (
                      <span className="truncate block" title={v.notes}>{v.notes}</span>
                    ) : (
                      <span className="text-gray-300 italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
