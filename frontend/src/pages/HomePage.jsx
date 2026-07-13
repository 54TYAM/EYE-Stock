import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import './HomePage.css';

const QUICK_PICKS = ['Apple', 'Tesla', 'NVIDIA', 'Microsoft'];

export default function HomePage({ setAnalysisData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedCompany, setSearchedCompany] = useState('');
  const [streamEvents, setStreamEvents] = useState([]);
  const navigate = useNavigate();

  const handleAnalyze = (companyName) => {
    setLoading(true);
    setError('');
    setSearchedCompany(companyName);
    setStreamEvents([]);

    const eventSource = new EventSource(`http://localhost:3001/api/analyze/stream?company=${encodeURIComponent(companyName)}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.step === 'complete') {
          setAnalysisData(data.result);
          eventSource.close();
          navigate('/results');
        } else if (data.step === 'error') {
          setError(data.error || 'Analysis failed. Please try again.');
          setLoading(false);
          eventSource.close();
        } else if (data.step === 'init') {
          setStreamEvents([{ label: 'Initializing AI Engine...', status: 'done' }]);
        } else {
          setStreamEvents((prev) => {
            const newEvents = [...prev];
            const existingIdx = newEvents.findIndex(e => e.label === data.label);
            if (existingIdx >= 0) {
              newEvents[existingIdx].status = data.status;
            } else {
              newEvents.push(data);
            }
            return newEvents;
          });
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      setError('Connection to server lost. Please try again.');
      setLoading(false);
      eventSource.close();
    };
  };

  if (loading) {
    return <ThinkingTimeline companyName={searchedCompany} streamEvents={streamEvents} />;
  }

  return (
    <div className="home-page stakely-home">
      <div className="spline-container-bg">
        <video
          className="bg-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero-content">
        <div className="hero-top-badge">
          <span className="status-dot"></span>
          #1 INVESTMENT INTELLIGENCE
        </div>

        <h1 className="hero-title stakely-title">
          Navigate Markets with <span className="striped-shadow-text" data-text="EYE Stock">EYE Stock</span>
        </h1>

        <p className="hero-subtitle stakely-subtitle">
          Discover, evaluate, and execute AI investment strategies all in one place, smart experience.
        </p>

        <div className="search-container">
          <SearchBox onSubmit={handleAnalyze} disabled={loading} />
          {error && (
            <p style={{ color: 'var(--pass-color)', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ThinkingTimeline({ companyName, streamEvents }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll as new items are added to the timeline
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, [streamEvents]);

  return (
    <div className="loading-page stakely-loading">
      <div className="loading-orb">
        <div className="loading-orb-inner"></div>
      </div>
      <h2 className="loading-title">Let's get started.</h2>
      <p className="loading-subtitle">How can I assist you with {companyName} today?</p>

      <div className="thinking-timeline glass-card">
        <div className="timeline-header">
          <span>✧ Analyzing {companyName}...</span>
          <span className="timer">{elapsed}s</span>
        </div>
        <div className="timeline-steps">
          {streamEvents.length === 0 && (
            <div className="timeline-step active">Connecting to Swarm...</div>
          )}
          {streamEvents.map((event, i) => (
            <div key={i} className={`timeline-step ${event.status === 'done' ? 'done' : 'active'}`}>
              <span className="icon">{event.status === 'done' ? '✓' : '✧'}</span> {event.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
