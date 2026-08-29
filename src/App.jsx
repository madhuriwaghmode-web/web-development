import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PatientsPage from './pages/PatientsPage'
import AddPatientPage from './pages/AddPatientPage'
import PatientProfilePage from './pages/PatientProfilePage'
import NewScreeningPage from './pages/NewScreeningPage'
import ScreeningResultPage from './pages/ScreeningResultPage'
import PatientHistoryPage from './pages/PatientHistoryPage'
import FollowUpsPage from './pages/FollowUpsPage'
import ReportsPage from './pages/ReportsPage'
import ReportPage from './pages/ReportPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/patients/new" element={<AddPatientPage />} />
              <Route path="/patients/:patientId" element={<PatientProfilePage />} />
              <Route path="/screening/new" element={<NewScreeningPage />} />
              <Route path="/screening/:screeningId/result" element={<ScreeningResultPage />} />
              <Route path="/history" element={<PatientHistoryPage />} />
              <Route path="/followups" element={<FollowUpsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/:screeningId" element={<ReportPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}
