import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Visualizer from './components/Visualizer';
import MagicBox from './components/MagicBox';
import SettingsPanel from './components/SettingsPanel';
import RecommendationsPanel from './components/RecommendationsPanel';
import BudgetPanel from './components/BudgetPanel';
import TravelRecordsPanel from './components/TravelRecordsPanel';
import PlanningModal from './components/PlanningModal';
import EditorPanel from './components/EditorPanel';
import { callAIService } from './services/aiService';
import { User, Bell, LayoutGrid, Settings, AlertTriangle } from 'lucide-react';

// Simple ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err) { return { hasError: true }; }
  componentDidCatch(err, errorInfo) { console.error("App Error:", err, errorInfo); }


  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0c0c0e', color: 'white', gap: '20px' }}>
          <AlertTriangle size={48} color="#f59e0b" />
          <h2 style={{ fontSize: '20px' }}>应用运行出现了一点小状况</h2>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: 'var(--accent-color)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>刷新页面</button>
        </div>
      );
    }
    return this.props.children;
  }
}


function App() {
  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState('');
  const [scenario, setScenario] = useState('itinerary'); // 'itinerary', 'hotel', 'log'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 34.992, lng: 135.772 }); // Initial focus on Four Seasons area

  const [activePlan, setActivePlan] = useState({

    destination: 'Kyoto, Japan',
    days: 5,
    hotelTier: '精品',
    waypoints: ['清水寺', '岚山竹林', '伏见稻荷']
  });


  // Persist sidebar states to localStorage - Default to CLOSED for result-first UI
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(() => {
    const saved = localStorage.getItem('isLeftPanelOpen');
    return saved ? JSON.parse(saved) : false;
  });
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(() => {
    const saved = localStorage.getItem('isRightPanelOpen');
    return saved ? JSON.parse(saved) : false;
  });

  // Panel width states
  const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
    const saved = localStorage.getItem('leftPanelWidth');
    return saved ? parseInt(saved) : 300;
  });
  const [rightPanelWidth, setRightPanelWidth] = useState(() => {
    const saved = localStorage.getItem('rightPanelWidth');
    return saved ? parseInt(saved) : 300;
  });

  // Persist sidebar states to localStorage
  const toggleLeftPanel = () => {
    const newState = !isLeftPanelOpen;
    setIsLeftPanelOpen(newState);
    localStorage.setItem('leftPanelOpen', JSON.stringify(newState));
  };
  const toggleRightPanel = () => {
    const newState = !isRightPanelOpen;
    setIsRightPanelOpen(newState);
    localStorage.setItem('rightPanelOpen', JSON.stringify(newState));
  };

  // Resize handlers
  const handleLeftResize = (newWidth) => {
    if (newWidth < 100) {
      setIsLeftPanelOpen(false);
      localStorage.setItem('leftPanelOpen', JSON.stringify(false));
    } else {
      const clampedWidth = Math.min(Math.max(newWidth, 200), 500);
      setLeftPanelWidth(clampedWidth);
      localStorage.setItem('leftPanelWidth', clampedWidth.toString());
      if (!isLeftPanelOpen) {
        setIsLeftPanelOpen(true);
        localStorage.setItem('leftPanelOpen', JSON.stringify(true));
      }
    }
  };

  const handleRightResize = (newWidth) => {
    if (newWidth < 100) {
      setIsRightPanelOpen(false);
      localStorage.setItem('rightPanelOpen', JSON.stringify(false));
    } else {
      const clampedWidth = Math.min(Math.max(newWidth, 200), 500);
      setRightPanelWidth(clampedWidth);
      localStorage.setItem('rightPanelWidth', clampedWidth.toString());
      if (!isRightPanelOpen) {
        setIsRightPanelOpen(true);
        localStorage.setItem('rightPanelOpen', JSON.stringify(true));
      }
    }
  };

  // AI Config State
  const [aiConfig, setAiConfig] = useState(() => {
    const saved = localStorage.getItem('ai_travel_config');
    return saved ? JSON.parse(saved) : {
      activeModel: 'mock',
      tokens: {
        openai: '',
        gemini: '',
        doubao: '',
        'qwen-max': '',
        qwen3: '',
        ernie: '',
        spark: ''
      }
    };
  });

  const handleUpdateConfig = (newConfig) => {
    setAiConfig(newConfig);
    localStorage.setItem('ai_travel_config', JSON.stringify(newConfig));
  };


  const handleCommand = async (cmd) => {
    try {
      const result = await callAIService(cmd, aiConfig);
      setResultText(result);
      setShowResult(true);
      // Simulate extraction of structured data for the Editor - preserve existing data
      setActivePlan(prev => ({ ...prev, destination: 'Kyoto, Japan' }));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario);
    setIsPlanningModalOpen(true); // Open modal when scenario button is clicked
  };

  return (
    <ErrorBoundary>
      <div className="app-root">

        {/* Fixed Top Navigation Bar */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'transparent',
          borderBottom: '1px solid transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 1000
        }}>
          {/* Left: Logo & App Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, var(--accent-color), #818cf8)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              ✈️
            </div>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>AI 旅游助手</span>
          </div>

          {/* Right: User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsSettingsOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
              </svg>
            </button>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              U
            </div>
          </div>
        </div>

        {/* Main Workbench - full height */}
        <div className="workbench">
          {/* 1. Left: Recommendations & Experience */}
          <RecommendationsPanel
            isOpen={isLeftPanelOpen}
            onToggle={toggleLeftPanel}
            width={leftPanelWidth}
            onResize={handleLeftResize}
          />

          {/* 2. Middle: Visualizer (includes Map + Studio + Travel Records modes) */}
          <Visualizer center={mapCenter} />


          {/* 3. Right: Budget Panel */}
          <BudgetPanel
            activePlan={activePlan}
            isOpen={isRightPanelOpen}
            onToggle={toggleRightPanel}
            width={rightPanelWidth}
            onResize={handleRightResize}
          />
        </div>

        {/* Overlays - Positioned outside grid flow */}
        <div className="overlays">
          {/* Main AI Interaction Box - Focused at the bottom */}
          <MagicBox
            onCommand={handleCommand}
            onScenarioChange={handleScenarioChange}
            activeScenario={scenario}
            onMapFocus={setMapCenter}
          />


          {/* Settings Panel Overlay */}
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            config={aiConfig}
            onUpdateConfig={handleUpdateConfig}
          />

          {/* Legacy Slide-over Panel (Optional for detailed AI text) */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                className="glass-card"
                style={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '600px',
                  maxHeight: '400px',
                  zIndex: 150,
                  padding: '24px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600 }}>AI 分析建议</h2>
                  <button
                    onClick={() => setShowResult(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    关闭
                  </button>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                  {resultText}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <style>{`
        .app-root {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }
      `}</style>
    </ErrorBoundary>
  );
}


export default App;
