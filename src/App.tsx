import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts';
import { useAuth } from './services/auth';
import {
  HomeScreen,
  SemesterView,
  LearningModule,
  TestingModule,
  ExamPrepMode,
  PastPaperMode,
  ScoreHistory,
  LoginPage,
} from './pages';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/semester/:semesterId" element={<SemesterView />} />
        <Route path="/learn/:topicId" element={<LearningModule />} />
        <Route path="/test/:topicId" element={<TestingModule />} />
        <Route path="/exam/:semesterId" element={<ExamPrepMode />} />
        <Route path="/past-paper" element={<PastPaperMode />} />
        <Route path="/scores" element={<ScoreHistory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
