import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import CliniciansTab from './components/CliniciansTab';
import PatientsTab from './components/PatientsTab';
import VisitsTab from './components/VisitsTab';

const navLinks = [
  { to: '/visits', label: 'Visits' },
  { to: '/clinicians', label: 'Clinicians' },
  { to: '/patients', label: 'Patients' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Visit Tracker</h1>
                <p className="text-xs text-gray-500">Internal clinical management system</p>
              </div>
            </div>
          </div>
        </header>

        {/* Nav */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1" aria-label="Main navigation">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-5 py-3 text-sm font-medium border-b-2 transition-colors ${isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Routes */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/visits" replace />} />
              <Route path="/visits" element={<VisitsTab />} />
              <Route path="/clinicians" element={<CliniciansTab />} />
              <Route path="/patients" element={<PatientsTab />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
