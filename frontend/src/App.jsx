import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={<HomePage setAnalysisData={setAnalysisData} />}
          />
          <Route
            path="/results"
            element={
              <ResultsPage
                analysisData={analysisData}
                setAnalysisData={setAnalysisData}
              />
            }
          />
          <Route
            path="/about"
            element={<AboutPage />}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
