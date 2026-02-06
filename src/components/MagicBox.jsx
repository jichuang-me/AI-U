import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Sparkles, Map, BookOpen, Hotel, X, Pin, Trash2, Plus, ChevronUp, History } from 'lucide-react';

const MagicBox = ({ onCommand, onScenarioChange, activeScenario }) => {
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showSmartCmdMenu, setShowSmartCmdMenu] = useState(false);
    const [showFunctionMenu, setShowFunctionMenu] = useState(false);
    const activePanel = activeScenario;

    const [newCmdText, setNewCmdText] = useState('');

    const smartMenuRef = useRef(null);
    const smartBtnRef = useRef(null);
    const funcMenuRef = useRef(null);
    const funcBtnRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSmartCmdMenu && smartMenuRef.current && !smartMenuRef.current.contains(event.target) && !smartBtnRef.current.contains(event.target)) {
                setShowSmartCmdMenu(false);
            }
            if (showFunctionMenu && funcMenuRef.current && !funcMenuRef.current.contains(event.target) && !funcBtnRef.current.contains(event.target)) {
                setShowFunctionMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [showSmartCmdMenu, showFunctionMenu]);

    const [smartCommands, setSmartCommands] = useState([
        { text: "我们在京都只有3天时间", pinned: true },
        { text: "预算控制在人均 8000 元", pinned: true },
        { text: "帮我避开人流密集的景点", pinned: false },
        { text: "我想 eat 当地最正宗的怀石料理", pinned: false },
        { text: "把行程安排得宽松一点", pinned: false }
    ]);

    const addSmartCommand = () => {
        if (!newCmdText.trim()) return;
        setSmartCommands([...smartCommands, { text: newCmdText, pinned: false }]);
        setNewCmdText('');
    };

    const deleteSmartCommand = (index, e) => {
        e.stopPropagation();
        setSmartCommands(smartCommands.filter((_, i) => i !== index));
    };

    const togglePinCommand = (index, e) => {
        e.stopPropagation();
        const newCmds = [...smartCommands];
        newCmds[index].pinned = !newCmds[index].pinned;
        setSmartCommands(newCmds);
    };

    const functions = [
        { id: 'itinerary', label: '路径规划', icon: <Map size={16} /> },
        { id: 'hotel', label: '酒店预定', icon: <Hotel size={16} /> },
        { id: 'log', label: '旅行日志', icon: <BookOpen size={16} /> },
        { id: 'creation', label: '创作模式', icon: <Sparkles size={16} /> }
    ];

    const currentFunction = functions.find(f => f.id === activePanel);

    const handleFunctionSelect = (funcId) => {
        onScenarioChange(funcId);
        setShowFunctionMenu(false);
    };

    const handleSend = (e) => {
        e?.preventDefault();
        if (!input.trim()) return;
        onCommand(input);
        setInput('');
    };

    return (
        <div className="magic-box-container" style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'flex-end', gap: '16px', zIndex: 4000 }}>

            <div style={{ position: 'relative' }}>
                <AnimatePresence>
                    {showSmartCmdMenu && (
                        <motion.div ref={smartMenuRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="glass-card" style={{ position: 'absolute', bottom: '70px', left: '0', width: '300px', maxHeight: '420px', padding: '16px', background: 'rgba(12, 12, 14, 0.96)', border: '1px solid var(--accent-color)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.7)' }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={16} />
                                <span>智能灵感</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {smartCommands.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map((cmd, i) => (
                                    <div key={i} className="menu-item" style={{ padding: '10px 12px', borderRadius: '10px', background: cmd.pinned ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255,255,255,0.03)', fontSize: '13px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'var(--transition)', border: '1px solid transparent' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                                        <span onClick={() => { setInput(cmd.text); setShowSmartCmdMenu(false); }} style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{cmd.text}</span>
                                        <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
                                            <Pin size={14} onClick={(e) => togglePinCommand(i, e)} style={{ cursor: 'pointer', color: cmd.pinned ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)', transition: '0.2s' }} />
                                            <Trash2 size={14} onClick={(e) => deleteSmartCommand(i, e)} style={{ cursor: 'pointer', color: 'rgba(255,100,100,0.4)', transition: '0.2s' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px' }}>
                                <input value={newCmdText} onChange={(e) => setNewCmdText(e.target.value)} placeholder="自定义灵感..." style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: 'white', outline: 'none' }} />
                                <button onClick={addSmartCommand} style={{ background: 'var(--accent-color)', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', transition: 'var(--transition)' }}><Plus size={18} /></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button ref={smartBtnRef} className="glass" onClick={() => setShowSmartCmdMenu(!showSmartCmdMenu)} style={{ width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: showSmartCmdMenu ? 'var(--accent-color)' : 'white', background: showSmartCmdMenu ? 'rgba(124, 58, 237, 0.1)' : 'var(--glass-bg)', borderColor: showSmartCmdMenu ? 'var(--accent-color)' : 'var(--glass-border)' }}>
                    <Sparkles size={24} />
                </button>
            </div>

            <div style={{ position: 'relative' }}>
                <AnimatePresence>
                    {showFunctionMenu && (
                        <motion.div ref={funcMenuRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-card" style={{ position: 'absolute', bottom: '76px', left: '0', width: '220px', padding: '10px', background: 'rgba(12, 12, 14, 0.98)', border: '1px solid var(--accent-color)', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 20px 40px rgba(0,0,0,0.7)' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', padding: '0 8px 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>功能模组</div>
                            {functions.map(fn => (
                                <div key={fn.id} onClick={() => handleFunctionSelect(fn.id)} className="menu-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', cursor: 'pointer', transition: 'var(--transition)', background: activePanel === fn.id ? 'rgba(124, 58, 237, 0.1)' : 'transparent', border: activePanel === fn.id ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid transparent' }}>
                                    <div style={{ color: activePanel === fn.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.6)' }}>{fn.icon}</div>
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: activePanel === fn.id ? 'white' : 'rgba(255,255,255,0.8)' }}>{fn.label}</span>
                                    {activePanel === fn.id && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-color)' }} />}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    layout
                    initial={false}
                    animate={{
                        width: input.length > 20 ? '720px' : '560px',
                        scale: isFocused ? 1.01 : 1,
                    }}
                    className="glass-card"
                    style={{
                        height: '60px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        gap: '12px',
                        background: isFocused ? 'rgba(12, 12, 14, 0.98)' : 'rgba(12, 12, 14, 0.85)',
                        border: isFocused ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)',
                        boxShadow: isFocused ? '0 0 30px rgba(124, 58, 237, 0.15)' : 'var(--shadow-lg)',
                        transition: 'background 0.3s ease, border-color 0.3s ease'
                    }}
                >
                    <div ref={funcBtnRef} onClick={() => setShowFunctionMenu(!showFunctionMenu)} style={{ height: '40px', padding: '0 14px', background: activePanel ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255,255,255,0.05)', border: activePanel ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'var(--transition)', minWidth: '120px' }}>
                        <div style={{ color: activePanel ? 'var(--accent-color)' : 'white' }}>{currentFunction ? currentFunction.icon : <Sparkles size={18} />}</div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'white', flex: 1 }}>{currentFunction ? currentFunction.label : '灵感模式'}</span>
                        <ChevronUp size={16} style={{ color: 'rgba(255,255,255,0.4)', transform: showFunctionMenu ? 'rotate(0)' : 'rotate(180deg)', transition: '0.3s' }} />
                    </div>
                    <form onSubmit={handleSend} style={{ flex: 1 }}>
                        <input value={input} onChange={(e) => setInput(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder={activePanel ? "向 AI 描述需要调整的内容..." : "说出你的目的地、预算或想法..."} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '15px', fontWeight: 400 }} />
                    </form>

                    <AnimatePresence>
                        {input.length > 2 && (
                            <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onClick={() => handleSend()}
                                className="premium-gradient"
                                style={{
                                    height: '36px',
                                    padding: '0 12px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Sparkles size={14} /> 一键规划
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div style={{ display: 'flex', gap: '8px', paddingRight: '4px' }}>
                        <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'var(--transition)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                            <Mic size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>

            <button className="glass" style={{ width: '54px', height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><History size={20} /></button>

            <style>{`
        .menu-item:hover { background: rgba(255, 255, 255, 0.1) !important; }
      `}</style>
        </div>
    );
};

export default MagicBox;
