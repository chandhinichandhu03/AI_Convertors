import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ConvertPage from './pages/ConvertPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AtsCareerSuite from './pages/AtsCareerSuite';
import CodeSqlSuite from './pages/CodeSqlSuite';
import MathScienceSuite from './pages/MathScienceSuite';
import DataLanguageSuite from './pages/DataLanguageSuite';
import GrammarLanguageSuite from './pages/GrammarLanguageSuite';
import RagAssistant from './pages/RagAssistant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/convert" element={<ConvertPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ats-career" element={<AtsCareerSuite />} />
        <Route path="/code-db" element={<CodeSqlSuite />} />
        <Route path="/math-science" element={<MathScienceSuite />} />
        <Route path="/data-language" element={<DataLanguageSuite />} />
        <Route path="/grammar-language" element={<GrammarLanguageSuite />} />
        <Route path="/rag-chatbot" element={<RagAssistant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
