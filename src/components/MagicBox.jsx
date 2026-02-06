import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


import { Mic, Send, Sparkles, Map, BookOpen, Hotel, X, Pin, Trash2, Plus, Save, Check, ChevronUp, History } from 'lucide-react';

const MagicBox = ({ onCommand, onMapFocus, onScenarioChange, activeScenario }) => {


    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showSmartCmdMenu, setShowSmartCmdMenu] = useState(false);
    const [showFunctionMenu, setShowFunctionMenu] = useState(false);
    const activePanel = activeScenario;
    const setActivePanel = onScenarioChange;

    const [saveStatus, setSaveStatus] = useState(null);

    // 自定义指令输入
    const [newCmdText, setNewCmdText] = useState('');

    // Refs 用于检测点击外部
    const smartMenuRef = useRef(null);
    const smartBtnRef = useRef(null);
    const funcMenuRef = useRef(null);
    const funcBtnRef = useRef(null);

    // 点击外部收起
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 1. Smart Menu
            if (showSmartCmdMenu && smartMenuRef.current && !smartMenuRef.current.contains(event.target) && !smartBtnRef.current.contains(event.target)) {
                setShowSmartCmdMenu(false);
            }
            // 2. Function Menu
            if (showFunctionMenu && funcMenuRef.current && !funcMenuRef.current.contains(event.target) && !funcBtnRef.current.contains(event.target)) {
                setShowFunctionMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [showSmartCmdMenu, showFunctionMenu]);

    // 1. 左侧：智能指令集 (支持管理)
    const [smartCommands, setSmartCommands] = useState([
        { text: "我们在京都只有3天时间", pinned: true },
        { text: "预算控制在人均 8000 元", pinned: true },
        { text: "帮我避开人流密集的景点", pinned: false },
        { text: "我想吃当地最正宗的怀石料理", pinned: false },
        { text: "把行程安排得宽松一点", pinned: false }
    ]);

    // 添加自定义指令
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

    // 2. 核心功能选项
    const functions = [
        { id: 'itinerary', label: '路径规划', icon: <Map size={16} /> },
        { id: 'hotel', label: '酒店预定', icon: <Hotel size={16} /> },
        { id: 'log', label: '行程形式', icon: <BookOpen size={16} /> }
    ];

    const currentFunction = functions.find(f => f.id === activePanel);

    // 面板数据 - 丰富化
    const [panels, setPanels] = useState({
        itinerary: {
            open: false, x: 100, y: 150,
            messages: [{ type: 'ai', text: '为您规划了从“京都站”到“清水寺”的详细方案。' }],
            data: {
                title: '路径规划方案报告',
                currentRoute: '方案 A',
                items: [
                    { type: 'step', label: '京都站 (起点)', time: '10:00', icon: '🚉' },
                    { type: 'transport', label: '乘 206 路巴士 (往东山方向)', time: '15min', icon: '🚌' },
                    { type: 'step', label: '五条坂站 (下车)', time: '10:15', icon: '📍' },
                    { type: 'transport', label: '步行爬坡 (三年坂方向)', time: '12min', icon: '🚶' },
                    { type: 'step', label: '清水寺 (终点)', time: '10:27', icon: '🏮' }
                ],
                alternatives: ['方案 B: 打车 (12min, ¥1200)', '方案 C: 步行探索 (35min)']
            }
        },
        hotel: {
            open: false, x: 200, y: 200,
            messages: [{ type: 'ai', text: '已锁定 2 家为您预留的优质酒店。点击名称可查看地图位置。' }],
            data: {
                title: '酒店预订详情',
                items: [
                    {
                        id: 'h1', name: '京都四季酒店 (Four Seasons)', price: '¥2800/晚',
                        stars: 5, address: '妙法院前側', selected: true,
                        coords: [34.992, 135.772],
                        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80'
                    },
                    {
                        id: 'h2', name: '祗园日式精品民宿 (Gion Ryokan)', price: '¥950/晚',
                        stars: 4.5, address: '祗园南侧', selected: false,
                        coords: [35.003, 135.778],
                        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80'
                    }
                ]
            }
        },
        log: {
            open: false, x: 150, y: 300,
            messages: [{ type: 'ai', text: '已根据行程生成多版本游记草稿，点击可切换。' }],
            data: {
                title: '旅行记录与输出形式',
                content: '《京都漫步：在三年坂遇见樱花》',
                style: '精美明信片',
                tags: ['胶片感', '详细攻略', '4张图']
            }
        }
    });

    // 酒店与地图联动处理
    const handleHotelClick = (hotel) => {
        setPanels(prev => {
            const newHotels = prev.hotel.data.items.map(h => ({
                ...h,
                selected: h.id === hotel.id
            }));
            return {
                ...prev,
                hotel: {
                    ...prev.hotel,
                    data: { ...prev.hotel.data, items: newHotels },
                    messages: [...prev.hotel.messages, { type: 'ai', text: `✨ 正在联动地图！已为您在地图上标记：${hotel.name}` }]
                }
            };
        });

        // 调用外部传入的地图联动函数
        if (onMapFocus) {
            onMapFocus({ lat: hotel.coords[0], lng: hotel.coords[1] });
        }
        console.log("Map Focus on:", hotel.name, hotel.coords);
    };


    // 核心修复：选择功能后强制打开面板
    const handleFunctionSelect = (funcId) => {
        console.log("Selected Function:", funcId);
        setActivePanel(funcId);
        onScenarioChange(funcId);
        setShowFunctionMenu(false);

        // 强制更新面板状态
        setPanels(prev => {
            const newState = { ...prev };
            // 先把所有其他的关掉，避免重叠干扰 (可选)
            // Object.keys(newState).forEach(k => newState[k].open = false);

            newState[funcId] = {
                ...prev[funcId],
                open: true, // 这一行至关重要
                x: window.innerWidth / 2 - 155, // 强制居中显示，防止飞出屏幕
                y: window.innerHeight / 2 - 200
            };
            return newState;
        });
    };

    const handleSend = (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        if (activePanel) {
            setPanels(prev => {
                const p = { ...prev[activePanel] };
                p.messages = [...p.messages, { type: 'user', text: input }];
                setTimeout(() => {
                    setPanels(curr => {
                        const next = { ...curr };
                        const act = next[activePanel]; // 使用闭包中的 activePanel 可能不准，但这里还好
                        act.messages = [...act.messages, { type: 'ai', text: `已根据“${input}”更新了内容。` }];

                        // 模拟更真实的 AI 数据变更逻辑
                        if (activePanel === 'itinerary') {
                            if (input.includes('快') || input.includes('打车')) {
                                act.data.currentRoute = '方案 B (打车模式)';
                                act.data.items = [
                                    { type: 'step', label: '京都站', time: '10:00', icon: '🚉' },
                                    { type: 'transport', label: '快捷打车', time: '12min', icon: '🚕' },
                                    { type: 'step', label: '清水寺', time: '10:12', icon: '🏮' }
                                ];
                            }
                        } else if (activePanel === 'hotel') {
                            if (input.includes('便宜') || input.includes('预算')) {
                                act.data.items = [
                                    {
                                        id: 'h3', name: '京都青年旅舍 (Hostel)', price: '¥220/晚',
                                        stars: 3, address: '五条通', selected: true,
                                        coords: [34.995, 135.759],
                                        image: 'https://images.unsplash.com/photo-1555854811-82242730daee?auto=format&fit=crop&w=300&q=80'
                                    },
                                    {
                                        id: 'h2', name: '祗园民宿', price: '¥950/晚',
                                        stars: 4.5, address: '祗园南侧', selected: false,
                                        coords: [35.003, 135.778],
                                        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80'
                                    }
                                ];
                            }
                        } else if (activePanel === 'log') {
                            act.data.content = input;
                        }
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

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => { setSaveStatus('done'); setTimeout(() => setSaveStatus(null), 2000); }, 1000);
    };

    return (
        <div className="magic-box-container" style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'flex-end', gap: '16px', zIndex: 4000 }}>

            {/* 1. 左侧：智能指令集 (支持自定义管理) */}
            <div style={{ position: 'relative' }}>
                <AnimatePresence>
                    {showSmartCmdMenu && (
                        <motion.div ref={smartMenuRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="glass-card" style={{ position: 'absolute', bottom: '70px', left: '0', width: '300px', maxHeight: '420px', padding: '16px', background: 'rgba(12, 12, 14, 0.96)', border: '1px solid var(--accent-color)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.7)' }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={16} />
                                <span>智能灵感</span>
                            </div>
                            {/* 指令列表 */}
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
                            {/* 添加区域 */}
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

            {/* 2. 中间：输入岛 + 功能选择器 */}
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

                <motion.div layout className="glass-card" style={{ width: '560px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', padding: '0 10px', gap: '12px', background: isFocused ? 'rgba(12, 12, 14, 0.98)' : 'rgba(12, 12, 14, 0.85)', border: isFocused ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)', boxShadow: isFocused ? '0 0 30px rgba(124, 58, 237, 0.15)' : 'var(--shadow-lg)' }}>
                    <div ref={funcBtnRef} onClick={() => setShowFunctionMenu(!showFunctionMenu)} style={{ height: '40px', padding: '0 14px', background: activePanel ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255,255,255,0.05)', border: activePanel ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'var(--transition)', minWidth: '120px' }}>
                        <div style={{ color: activePanel ? 'var(--accent-color)' : 'white' }}>{currentFunction ? currentFunction.icon : <Sparkles size={18} />}</div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'white', flex: 1 }}>{currentFunction ? currentFunction.label : '灵感模式'}</span>
                        <ChevronUp size={16} style={{ color: 'rgba(255,255,255,0.4)', transform: showFunctionMenu ? 'rotate(0)' : 'rotate(180deg)', transition: '0.3s' }} />
                    </div>
                    <form onSubmit={handleSend} style={{ flex: 1 }}>
                        <input value={input} onChange={(e) => setInput(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder={activePanel ? "向 AI 描述需要调整的内容..." : "说出你的目的地、预算或想法..."} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '15px', fontWeight: 400 }} />
                    </form>
                    <div style={{ display: 'flex', gap: '12px', paddingRight: '4px' }}>
                        <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'var(--transition)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                            <Mic size={22} />
                        </button>
                        <button onClick={handleSend} disabled={!input.trim()} style={{ background: input.trim() ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', color: input.trim() ? 'white' : 'rgba(255,255,255,0.2)', transition: 'var(--transition)' }}>
                            <Send size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>

            <button className="glass" style={{ width: '54px', height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><History size={20} /></button>

            {/* 4. 强制弹出的面板 (Active Panels) */}
            <AnimatePresence>
                {Object.entries(panels).map(([id, p]) => p.open && (
                    <motion.div key={id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} drag dragMomentum={false} className="glass-card" style={{ position: 'fixed', top: p.y, left: p.x, width: '310px', display: 'flex', flexDirection: 'column', background: 'rgba(12, 12, 14, 0.98)', border: activePanel === id ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)', zIndex: activePanel === id ? 4100 : 4000, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }} onPointerDown={() => setActivePanel(id)}>
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'move' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>{functions.find(f => f.id === id)?.icon} {p.data.title}</span>
                            <X size={14} style={{ cursor: 'pointer' }} onClick={() => setPanels(prev => ({ ...prev, [id]: { ...p, open: false } }))} />
                        </div>
                        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', overflowY: 'auto', maxHeight: '220px' }}>
                            {/* 路径详情展示 */}
                            {id === 'itinerary' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: 600, marginBottom: '4px' }}>当前优选: {p.data.currentRoute}</div>
                                    {p.data.items.map((it, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                                            <div style={{ width: '20px', textAlign: 'center', fontSize: '14px' }}>{it.icon}</div>
                                            <div style={{ flex: 1, paddingBottom: i !== p.data.items.length - 1 ? '12px' : '0', borderLeft: i !== p.data.items.length - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none', paddingLeft: '12px', marginLeft: '-21px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: 600 }}>{it.label}</div>
                                                <div style={{ fontSize: '10px', opacity: 0.5 }}>{it.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '10px', opacity: 0.5, marginBottom: '6px' }}>其他备选:</div>
                                        {p.data.alternatives.map((alt, i) => <div key={i} style={{ fontSize: '11px', color: 'var(--accent-color)', cursor: 'pointer', marginBottom: '4px' }}>• {alt}</div>)}
                                    </div>
                                </div>
                            )}

                            {/* 酒店详情展示 */}
                            {id === 'hotel' && p.data.items.map((hotel, i) => (
                                <div key={i} onClick={() => handleHotelClick(hotel)} style={{
                                    padding: '10px', background: hotel.selected ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                    borderRadius: '10px', marginBottom: '10px', border: hotel.selected ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                    <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                                        <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: hotel.selected ? 'var(--accent-color)' : 'white' }}>{hotel.name}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                        <span style={{ fontSize: '12px', color: '#fbbf24' }}>{'★'.repeat(Math.floor(hotel.stars))}{hotel.stars % 1 !== 0 ? '½' : ''}</span>
                                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{hotel.price}</span>
                                    </div>
                                    <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>📍 {hotel.address}</div>
                                </div>
                            ))}

                            {/* 日志/形式展示 */}
                            {id === 'log' && (
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={{ width: '100%', height: '100px', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div style={{ fontSize: '24px' }}>📸</div>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>{p.data.content}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: 600 }}>{p.data.style}</div>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '10px' }}>
                                        {p.data.tags.map(tag => <span key={tag} style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>#{tag}</span>)}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ flex: 1, maxHeight: '120px', overflowY: 'auto', padding: '10px', borderTop: '1px solid var(--glass-border)' }}>
                            {p.messages.map((m, i) => <div key={i} style={{ fontSize: '11px', marginBottom: '6px', marginTop: '6px', color: m.type === 'ai' ? 'rgba(255,255,255,0.8)' : 'var(--accent-color)', textAlign: m.type === 'ai' ? 'left' : 'right', background: m.type === 'ai' ? 'transparent' : 'rgba(99,102,241,0.1)', padding: m.type === 'ai' ? '0' : '4px 8px', borderRadius: '8px', display: 'inline-block', maxWidth: '90%' }}>{m.text}</div>)}
                        </div>
                        <div style={{ padding: '10px', borderTop: '1px solid var(--glass-border)' }}>
                            <button onClick={handleSave} style={{ width: '100%', padding: '10px', background: 'var(--accent-color)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600 }}>{saveStatus === 'done' ? <Check size={14} /> : <Save size={14} />} {saveStatus === 'done' ? '已记录' : '保存并记录'}</button>
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
