import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Visualizer from './components/Visualizer';
import MagicBox from './components/MagicBox';
import SettingsPanel from './components/SettingsPanel';
import RecommendationsPanel from './components/RecommendationsPanel';
import BudgetPanel from './components/BudgetPanel';
import PlanningModal from './components/PlanningModal';
import { callAIService } from './services/aiService';
import { Bell, Settings, AlertTriangle } from 'lucide-react';

// Simple ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
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
    localStorage.setItem('isLeftPanelOpen', JSON.stringify(newState));
  };
  const toggleRightPanel = () => {
    const newState = !isRightPanelOpen;
    setIsRightPanelOpen(newState);
    localStorage.setItem('isRightPanelOpen', JSON.stringify(newState));
  };

  // Resize handlers
  const handleLeftResize = (newWidth) => {
    if (newWidth < 100) {
      setIsLeftPanelOpen(false);
      localStorage.setItem('isLeftPanelOpen', JSON.stringify(false));
    } else {
      const clampedWidth = Math.min(Math.max(newWidth, 200), 500);
      setLeftPanelWidth(clampedWidth);
      localStorage.setItem('leftPanelWidth', clampedWidth.toString());
      if (!isLeftPanelOpen) {
        setIsLeftPanelOpen(true);
        localStorage.setItem('isLeftPanelOpen', JSON.stringify(true));
      }
    }
  };

  const handleRightResize = (newWidth) => {
    if (newWidth < 100) {
      setIsRightPanelOpen(false);
      localStorage.setItem('isRightPanelOpen', JSON.stringify(false));
    } else {
      const clampedWidth = Math.min(Math.max(newWidth, 200), 500);
      setRightPanelWidth(clampedWidth);
      localStorage.setItem('rightPanelWidth', clampedWidth.toString());
      if (!isRightPanelOpen) {
        setIsRightPanelOpen(true);
        localStorage.setItem('isRightPanelOpen', JSON.stringify(true));
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
      setActivePlan(prev => ({ ...prev, destination: 'Kyoto, Japan' }));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario);
    setIsPlanningModalOpen(true);
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
          height: '70px',
          background: 'rgba(5, 5, 6, 0.4)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          zIndex: 1000
        }}>
          {/* Left: Logo & App Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="premium-gradient" style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              ✈️
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>AI 游</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Next-gen Travel</div>
            </div>
          </div>

          {/* Right: User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsSettingsOpen(true)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  cursor: 'pointer',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'var(--accent-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <Settings size={18} />
              </button>
              <button
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  cursor: 'pointer',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}
              >
                <Bell size={18} />
              </button>
            </div>

            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              border: '2px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              JD
            </div>
          </div>
        </div>

        {/* Main Workbench */}
        <div className="workbench">
          <RecommendationsPanel
            isOpen={isLeftPanelOpen}
            onToggle={toggleLeftPanel}
            width={leftPanelWidth}
            onResize={handleLeftResize}
          />
          <Visualizer center={mapCenter} />
          <BudgetPanel
            activePlan={activePlan}
            isOpen={isRightPanelOpen}
            onToggle={toggleRightPanel}
            width={rightPanelWidth}
            onResize={handleRightResize}
          />
        </div>

        {/* Overlays */}
        <div className="overlays">
          <MagicBox
            onCommand={handleCommand}
            onScenarioChange={handleScenarioChange}
            activeScenario={scenario}
            onMapFocus={setMapCenter}
          />
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            config={aiConfig}
            onUpdateConfig={handleUpdateConfig}
          />
          <PlanningModal
            isOpen={isPlanningModalOpen}
            onClose={() => setIsPlanningModalOpen(false)}
            scenario={scenario}
            activePlan={activePlan}
            onUpdate={setActivePlan}
          />
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
