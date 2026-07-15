import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CodeModePage, StudentModePage, WordRainPage } from './pages/GameModesPage';
import { MultiplayerRacePage } from './pages/MultiplayerRacePage';
import { AchievementsPage, DailyChallengePage, HistoryPage, LeaderboardPage, ProfilePage, SettingsPage } from './pages/InfoPages';
import { LandingPage } from './pages/LandingPage';
import { TypingTestPage } from './pages/TypingTestPage';
import { BossBattlePage } from './pages/BossBattlePage';
import { LearningLibraryPage } from './pages/LearningLibraryPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/typing-test" element={<TypingTestPage />} />
        <Route path="/race" element={<MultiplayerRacePage />} />
        <Route path="/word-rain" element={<WordRainPage />} />
        <Route path="/boss-battle" element={<BossBattlePage />} />
        <Route path="/code" element={<CodeModePage />} />
        <Route path="/student" element={<StudentModePage />} />
        <Route path="/library" element={<LearningLibraryPage />} />
        <Route path="/daily" element={<DailyChallengePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
