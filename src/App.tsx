import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts';
import {
  HomeScreen,
  SemesterView,
  LearningModule,
  TestingModule,
  ExamPrepMode,
  PastPaperMode,
  ScoreHistory,
} from './pages';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
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
