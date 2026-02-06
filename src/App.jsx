import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Visualizer from './components/Visualizer';
import MagicBox from './components/MagicBox';
import SettingsPanel from './components/SettingsPanel';
import RecommendationsPanel from './components/RecommendationsPanel';
import BudgetPanel from './components/BudgetPanel';
import PlanningModal from './components/PlanningModal';
import { callAIService } from './services/aiService';
import { Bell, Settings, AlertTriangle, Trash2 } from 'lucide-react';

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
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0c0c0e', color: 'white', gap: '20px', textAlign: 'center', padding: '20px' }}>
          <AlertTriangle size={64} color="#f59e0b" />
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>应用运行出现了一点小状况</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>可能是由于保存的数据不兼容导致的</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: 'var(--accent-color)', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>刷新页面</button>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '12px 24px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: '12px', color: '#ff6464', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trash2 size={16} /> 重置所有数据
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState('');
  const [scenario, setScenario] = useState(() => {
    const saved = localStorage.getItem('activeScenario');
    return saved || 'itinerary';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activePlan, setActivePlan] = useState(() => {
    try {
      const saved = localStorage.getItem('activePlan');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.error("Failed to parse activePlan:", e);
    }
    return {
      itinerary: {
        destination: 'Kyoto, Japan',
        days: 5,
        hotelTier: '精品',
        waypoints: ['清水寺', '岚山竹林', '伏见稻荷']
      },
      hotel: {
        region: '市中心',
        budget: 800,
        rating: 4
      },
      log: {
        date: new Date().toISOString().split('T')[0],
        mood: '期待这次旅行！',
        content: ''
      },
      creation: {
        prompt: '',
        style: 'Modern',
        elements: ['Cityscape', 'Food', 'Culture'],
        output: 'Pending AI generation...'
      }
    };
  });

  const [modalStates, setModalStates] = useState(() => {
    try {
      const saved = localStorage.getItem('modalStates');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        // Validate structure
        if (parsed && typeof parsed === 'object' && parsed.itinerary && parsed.hotel) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load modalStates from localStorage:", e);
    }
    return {
      itinerary: { x: 100, y: 100, width: 550, height: 650, isOpen: false, zIndex: 1000 },
      hotel: { x: 200, y: 150, width: 550, height: 650, isOpen: false, zIndex: 1000 },
      log: { x: 300, y: 200, width: 550, height: 650, isOpen: false, zIndex: 1000 },
      creation: { x: 400, y: 100, width: 550, height: 650, isOpen: false, zIndex: 1000 }
    };
  });

  // Sync modalStates to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem('modalStates', JSON.stringify(modalStates));
    } catch (e) {
      console.warn("Failed to save modalStates:", e);
    }
  }, [modalStates]);

  const [topZ, setTopZ] = useState(1100);

  const bringToFront = (id) => {
    setTopZ(prev => prev + 1);
    setModalStates(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: topZ + 1 }
    }));
  };


  // Sync state to localStorage
  useEffect(() => {
    if (activePlan) {
      localStorage.setItem('activePlan', JSON.stringify(activePlan));
    }
  }, [activePlan]);

  useEffect(() => {
    if (scenario) {
      localStorage.setItem('activeScenario', scenario);
    }
  }, [scenario]);

  // Persist sidebar states to localStorage - Default to OPEN for immediate feedback
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('isLeftPanelOpen');
      return saved !== null ? JSON.parse(saved) : true;
    } catch { return true; }
  });
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('isRightPanelOpen');
      return saved !== null ? JSON.parse(saved) : true;
    } catch { return true; }
  });

  const [leftPanelWidth, setLeftPanelWidth] = useState(380);
  const [rightPanelWidth, setRightPanelWidth] = useState(380);
  const [visualizerMode, setVisualizerMode] = useState('map');

  const [aiConfig, setAiConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('aiConfig');
      return saved ? JSON.parse(saved) : {
        model: 'gpt-4o',
        temperature: 0.7,
        apiKey: ''
      };
    } catch {
      return { model: 'gpt-4o', temperature: 0.7, apiKey: '' };
    }
  });

  const handleUpdateConfig = (newConfig) => {
    setAiConfig(newConfig);
    localStorage.setItem('aiConfig', JSON.stringify(newConfig));
  };

  const handleCommand = async (command) => {
    try {
      const response = await callAIService(command, aiConfig, { activePlan, scenario });

      // Autonomous state reaction: Parse JSON updates if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          if (data.updates) {
            setActivePlan(prev => {
              const newPlan = { ...prev };
              Object.keys(data.updates).forEach(key => {
                newPlan[key] = { ...newPlan[key], ...data.updates[key] };
              });
              return newPlan;
            });
            console.log("Autonomous State Update Applied:", data.updates);
          }
        } catch (e) {
          console.error("Failed to parse autonomous update:", e);
        }
      }

      // Hide the raw JSON from the user UI for a cleaner experience
      const displayContent = response.replace(/```json\n([\s\S]*?)\n```/, '').trim();
      setResultText(displayContent);
      setShowResult(true);

      // Smart scenario detection
      const lowerCmd = command.toLowerCase();
      if (lowerCmd.includes('酒店') || lowerCmd.includes('住') || lowerCmd.includes('hotel')) {
        handleScenarioChange('hotel');
      } else if (lowerCmd.includes('行程') || lowerCmd.includes('路线') || lowerCmd.includes('plan') || lowerCmd.includes('itinerary')) {
        handleScenarioChange('itinerary');
      } else if (lowerCmd.includes('记录') || lowerCmd.includes('足迹') || lowerCmd.includes('records')) {
        handleScenarioChange('records');
      } else if (lowerCmd.includes('创作') || lowerCmd.includes('画') || lowerCmd.includes('写') || lowerCmd.includes('creation')) {
        handleScenarioChange('creation');
      } else if (lowerCmd.includes('日志') || lowerCmd.includes('记') || lowerCmd.includes('log')) {
        handleScenarioChange('log');
      }
    } catch (error) {
      setResultText("AI 响应失败: " + (error.message || "请稍后再试或检查配置。"));
      setShowResult(true);
    }
  };

  const handleUpdatePlan = (key, data) => {
    setActivePlan(prev => ({
      ...prev,
      [key]: { ...prev[key], ...data }
    }));
  };

  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario);

    // Sync Visualizer View Mode
    if (newScenario === 'itinerary' || newScenario === 'hotel') {
      setVisualizerMode('map');
    } else if (newScenario === 'creation') {
      setVisualizerMode('studio');
    } else if (newScenario === 'records') {
      setVisualizerMode('records');
    }

    setModalStates(prev => {
      const newState = { ...prev };

      // Ensure the requested scenario state exists (Defensive fix for old localStorage)
      if (!newState[newScenario]) {
        newState[newScenario] = { x: 200, y: 200, width: 550, height: 650, isOpen: true, zIndex: topZ + 1 };
      }

      // Close all others and open the requested one
      Object.keys(newState).forEach(key => {
        newState[key] = { ...newState[key], isOpen: key === newScenario };
      });

      newState[newScenario].zIndex = topZ + 1;
      return newState;
    });
    setTopZ(prev => prev + 1);
  };

  const updateModalState = (id, updates) => {
    setModalStates(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  };

  const handleLeftResize = (newWidth) => {
    setLeftPanelWidth(newWidth);
  };

  const handleRightResize = (newWidth) => {
    setRightPanelWidth(newWidth);
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  // notifications placeholder removed for brevity

  const syncAll = useCallback(() => {
    localStorage.setItem('activePlan', JSON.stringify(activePlan));
    localStorage.setItem('modalStates', JSON.stringify(modalStates));
    localStorage.setItem('activeScenario', scenario);
    console.log("States Synced!");
  }, [activePlan, modalStates, scenario]);

  useEffect(() => { syncAll(); }, [syncAll]);

  return (
    <ErrorBoundary>
      <div className="app-container" style={{ background: '#020203', color: 'white', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <PremiumBackground />

        {/* Global Toolbar - Fixed Floating Layer */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: 'rgba(5, 5, 8, 0.7)',
          backdropFilter: 'blur(30px)',
          zIndex: 9999
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="premium-gradient" style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 900, fontSize: '18px' }}>U</span>
              </div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI游 <span style={{ fontSize: '10px', color: 'var(--accent-color)', marginLeft: '4px', verticalAlign: 'top' }}>BETA</span>
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Bell size={18} />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Settings size={18} />
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
            onToggle={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            width={leftPanelWidth}
            onResize={handleLeftResize}
          />
          <Visualizer mode={visualizerMode} />
          <BudgetPanel
            activePlan={activePlan}
            isOpen={isRightPanelOpen}
            onToggle={() => setIsRightPanelOpen(!isRightPanelOpen)}
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
          />
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            config={aiConfig}
            onUpdateConfig={handleUpdateConfig}
          />
          {Object.entries(modalStates).map(([id, state]) => (
            <PlanningModal
              key={id}
              id={id}
              isOpen={state.isOpen}
              onClose={() => setModalStates(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }))}
              data={activePlan[id]}
              onUpdate={(data) => handleUpdatePlan(id, data)}
              modalState={state}
              onModalUpdate={(updates) => updateModalState(id, updates)}
              onFocus={() => bringToFront(id)}
              aiConfig={aiConfig}
            />
          ))}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="glass-card"
                style={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '50%',
                  x: '-50%',
                  width: '640px',
                  maxHeight: '400px',
                  zIndex: 8000,
                  padding: '24px',
                  overflowY: 'auto',
                  border: '1px solid var(--accent-color)'
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
    </ErrorBoundary>
  );
}

const PremiumBackground = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-20%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
    </div>
  );
};

export default App;
