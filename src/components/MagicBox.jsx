import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Sparkles, Map, BookOpen, Hotel, X, Pin, Trash2, Plus, Save, Check, Volume2, ChevronUp, History } from 'lucide-react';

const MagicBox = ({ onCommand }) => {
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [activePanel, setActivePanel] = useState(null);

    // 两个菜单的状态
    const [showSmartCmdMenu, setShowSmartCmdMenu] = useState(false);
    const [showFunctionMenu, setShowFunctionMenu] = useState(false);

    const [saveStatus, setSaveStatus] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    // Refs 用于检测点击外部
    const smartMenuRef = useRef(null);
    const smartBtnRef = useRef(null);
    const funcMenuRef = useRef(null);
    const funcBtnRef = useRef(null);

    // 点击外部收起菜单逻辑
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 1. 处理左侧智能指令菜单
            if (
                showSmartCmdMenu &&
                smartMenuRef.current &&
                !smartMenuRef.current.contains(event.target) &&
                smartBtnRef.current &&
                !smartBtnRef.current.contains(event.target)
            ) {
                setShowSmartCmdMenu(false);
            }

            // 2. 处理功能选择菜单
            if (
                showFunctionMenu &&
                funcMenuRef.current &&
                !funcMenuRef.current.contains(event.target) &&
                funcBtnRef.current &&
                !funcBtnRef.current.contains(event.target)
            ) {
                setShowFunctionMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSmartCmdMenu, showFunctionMenu]);

    // 1. 左侧：智能指令集
    const [smartCommands, setSmartCommands] = useState([
        { text: "我们在京都只有3天时间", pinned: true },
        { text: "预算控制在人均 8000 元", pinned: true },
        { text: "帮我避开人流密集的景点", pinned: false },
        { text: "我想吃当地最正宗的怀石料理", pinned: false },
        { text: "把行程安排得宽松一点", pinned: false }
    ]);

    // 2. 核心功能选项
    const functions = [
        { id: 'itinerary', label: '路径规划', icon: <Map size={16} /> },
        { id: 'hotel', label: '酒店预定', icon: <Hotel size={16} /> },
        { id: 'log', label: '行程形式', icon: <BookOpen size={16} /> }
    ];

    const currentFunction = functions.find(f => f.id === activePanel);

    // 面板数据模型 (内容更具体)
    const [panels, setPanels] = useState({
        itinerary: {
            open: false, x: 100, y: 150,
            messages: [{ type: 'ai', text: '为您规划了前往“清水寺”的 2 种最佳方案。' }],
            data: { title: '路径规划方案', items: [{ label: '方案 A: 地铁+步行 (推荐)', time: '20min / ¥230', active: true }, { label: '方案 B: 观光巴士直达', time: '45min / ¥500', active: false }] }
        },
        hotel: {
            open: false, x: 200, y: 200,
            messages: [{ type: 'ai', text: '根据预算找到了 2 家京都核心区酒店。' }],
            data: { title: '酒店预订对比', items: [{ name: '京都四季酒店', price: '¥2800/晚', selected: true, tags: ['奢华', '近景点'] }, { name: '祗园日式民宿', price: '¥900/晚', selected: false, tags: ['性比价', '安静'] }] }
        },
        log: {
            open: false, x: 150, y: 300,
            messages: [{ type: 'ai', text: '行程形式已设定，可随时调整风格。' }],
            data: { title: '行程形式设定', content: '标题：京都三日·古都巡礼', style: '风格：极简人文风', tags: ['Plog', '详细'] }
        }
    });

    const handleFunctionSelect = (funcId) => {
        setActivePanel(funcId);
        setShowFunctionMenu(false);

        // 强制打开对应的面板，并重置位置避免重叠(可选)
        setPanels(prev => ({
            ...prev,
            [funcId]: { ...prev[funcId], open: true }
        }));
    };

    const handleSmartCmdClick = (cmd) => {
        setInput(cmd.text);
        setShowSmartCmdMenu(false);
    };

    const handleSend = (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        if (activePanel) {
            setPanels(prev => {
                const p = { ...prev[activePanel] };
                p.messages = [...p.messages, { type: 'user', text: input }];

                setTimeout(() => {
                    setPanels(current => {
                        const next = { ...current };
                        const active = next[activePanel];
                        active.messages = [...active.messages, { type: 'ai', text: `好的，已根据“${input}”为您更新了方案细节。` }];
                        if (activePanel === 'itinerary') active.data.items[1].active = true;
                        else if (activePanel === 'hotel') active.data.items[1].selected = true;
                        else if (activePanel === 'log') active.data.content = input;
                        return next;
                    });
                }, 600);
                return { ...prev, [activePanel]: p };
            });
        } else {
            onCommand(input);
        }
        setInput('');
    };

    const handleSave = (id) => {
        setSaveStatus('saving');
        setTimeout(() => {
            setSaveStatus('done');
            setTimeout(() => setSaveStatus(null), 2000);
        }, 1000);
    };

    return (
        <div className="magic-box-container" style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'flex-end', gap: '16px', zIndex: 4000 }}>

            {/* 1. 最左侧：独立智能指令按钮 */}
            <div style={{ position: 'relative' }}>
                <AnimatePresence>
                    {showSmartCmdMenu && (
                        <motion.div ref={smartMenuRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="glass-card" style={{ position: 'absolute', bottom: '70px', left: '0', width: '260px', maxHeight: '300px', padding: '12px', background: 'rgba(12, 12, 14, 0.98)', border: '1px solid var(--accent-color)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>✨ 常用快捷指令</span>
                            </div>
                            {smartCommands.map((cmd, i) => (
                                <div key={i} onClick={() => handleSmartCmdClick(cmd)} style={{ padding: '8px 12px', borderRadius: '8px', background: cmd.pinned ? 'rgba(99, 102, 241, 0.1)' : 'transparent', fontSize: '13px', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="menu-item">
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{cmd.text}</span>
                                    {cmd.pinned && <Pin size={10} color="var(--accent-color)" />}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                <button ref={smartBtnRef} className="glass" onClick={() => setShowSmartCmdMenu(!showSmartCmdMenu)} style={{ width: '54px', height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: showSmartCmdMenu ? 'var(--accent-color)' : 'white' }}>
                    <Sparkles size={22} />
                </button>
            </div>

            {/* 2. 中间：输入岛 + 功能选择器 */}
            <div style={{ position: 'relative' }}>
                {/* 功能选择菜单 */}
                <AnimatePresence>
                    {showFunctionMenu && (
                        <motion.div ref={funcMenuRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-card" style={{ position: 'absolute', bottom: '70px', left: '0', width: '200px', padding: '8px', background: 'rgba(12, 12, 14, 0.98)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {functions.map(fn => (
                                <div key={fn.id} onClick={() => handleFunctionSelect(fn.id)} className="menu-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                    <div style={{ color: activePanel === fn.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.7)' }}>{fn.icon}</div>
                                    <span style={{ fontSize: '14px', color: activePanel === fn.id ? 'white' : 'rgba(255,255,255,0.8)' }}>{fn.label}</span>
                                    {activePanel === fn.id && <Check size={14} color="var(--accent-color)" style={{ marginLeft: 'auto' }} />}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div layout className="glass-card" style={{ width: '500px', height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', padding: '0 12px 0 8px', gap: '10px', background: isFocused ? 'rgba(12, 12, 14, 0.95)' : 'rgba(12, 12, 14, 0.7)', border: isFocused ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)' }}>

                    {/* 药丸选择器 */}
                    <div ref={funcBtnRef} onClick={() => setShowFunctionMenu(!showFunctionMenu)} style={{ height: '36px', padding: '0 10px 0 8px', background: activePanel ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.05)', border: activePanel ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: '0.2s', minWidth: '110px' }}>
                        <div style={{ color: activePanel ? 'var(--accent-color)' : 'white' }}>
                            {currentFunction ? currentFunction.icon : <Sparkles size={16} />}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'white', flex: 1 }}>
                            {currentFunction ? currentFunction.label : '快捷功能'}
                        </span>
                        <ChevronUp size={14} style={{ color: 'rgba(255,255,255,0.5)', transform: showFunctionMenu ? 'rotate(0)' : 'rotate(180deg)', transition: '0.3s' }} />
                    </div>

                    {/* 输入框 */}
                    <form onSubmit={handleSend} style={{ flex: 1 }}>
                        <input value={input} onChange={(e) => setInput(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder={activePanel ? "在此输入以修改面板内容..." : "对话或选择功能..."} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '14px' }} />
                    </form>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Mic size={20} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }} />
                        <Send size={20} onClick={handleSend} style={{ cursor: 'pointer', color: input ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)' }} />
                    </div>
                </motion.div>
            </div>

            {/* 3. 右侧：历史记录按钮 */}
            <button className="glass" style={{ width: '54px', height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <History size={20} />
            </button>

            {/* 悬浮面板 (Content Panels) */}
            <AnimatePresence>
                {Object.entries(panels).map(([id, p]) => p.open && (
                    <motion.div key={id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} drag dragMomentum={false} className="glass-card" style={{ position: 'fixed', top: p.y, left: p.x, width: '310px', display: 'flex', flexDirection: 'column', background: 'rgba(12, 12, 14, 0.98)', border: activePanel === id ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)', zIndex: activePanel === id ? 4100 : 4000, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }} onPointerDown={() => setActivePanel(id)}>
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'move' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>{functions.find(f => f.id === id)?.icon} {p.data.title}</span>
                            <X size={14} style={{ cursor: 'pointer' }} onClick={() => setPanels(prev => ({ ...prev, [id]: { ...p, open: false } }))} />
                        </div>
                        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                            {id === 'itinerary' && p.data.items.map((it, i) => <div key={i} style={{ fontSize: '12px', padding: '8px', background: it.active ? 'rgba(99,102,241,0.15)' : 'transparent', borderRadius: '6px', marginBottom: '6px', border: it.active ? '1px solid var(--accent-color)' : '1px solid transparent' }}>{it.label} <span style={{ opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>{it.time}</span></div>)}
                            {id === 'hotel' && p.data.items.map((it, i) => <div key={i} style={{ fontSize: '12px', padding: '8px', background: it.selected ? 'rgba(99,102,241,0.15)' : 'transparent', borderRadius: '6px', marginBottom: '6px', border: it.selected ? '1px solid var(--accent-color)' : '1px solid transparent' }}>{it.name} <span style={{ float: 'right' }}>{it.price}</span></div>)}
                            {id === 'log' && <div style={{ fontSize: '13px', textAlign: 'center', padding: '10px' }}><div style={{ fontWeight: 600 }}>{p.data.content}</div><div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>{p.data.style}</div></div>}
                        </div>
                        <div style={{ flex: 1, maxHeight: '120px', overflowY: 'auto', padding: '10px', borderTop: '1px solid var(--glass-border)' }}>
                            {p.messages.map((m, i) => <div key={i} style={{ fontSize: '11px', marginBottom: '6px', marginTop: '6px', color: m.type === 'ai' ? 'rgba(255,255,255,0.8)' : 'var(--accent-color)', textAlign: m.type === 'ai' ? 'left' : 'right', background: m.type === 'ai' ? 'transparent' : 'rgba(99,102,241,0.1)', padding: m.type === 'ai' ? '0' : '4px 8px', borderRadius: '8px', display: 'inline-block', maxWidth: '90%' }}>{m.text}</div>)}
                        </div>
                        <div style={{ padding: '10px', borderTop: '1px solid var(--glass-border)' }}>
                            <button onClick={() => handleSave(id)} style={{ width: '100%', padding: '10px', background: 'var(--accent-color)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600 }}>
                                {saveStatus === 'done' ? <Check size={14} /> : <Save size={14} />} {saveStatus === 'done' ? '已记录' : '保存并记录'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <style>{`
        .menu-item:hover { background: rgba(255, 255, 255, 0.1) !important; }
      `}</style>
        </div>
    );
};

export default MagicBox;
