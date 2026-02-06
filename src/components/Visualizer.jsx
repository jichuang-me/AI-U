import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


import MapContainer from './MapContainer';
import TravelRecordsPanel from './TravelRecordsPanel';
import { Map, FileText, Notebook, Calendar, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const Visualizer = ({ mode = 'map', center }) => {

    const [currentView, setCurrentView] = useState(mode);
    const [isPanelVisible, setIsPanelVisible] = useState(true);

    // 模拟今日详细行程数据
    const todaySteps = [
        { time: '10:30', title: '出发：京都站', detail: '从中央口乘巴士', done: true },
        { time: '11:15', title: '景点：清水寺', detail: '建议游玩 2 小时', current: true },
        { time: '13:30', title: '美食：三年坂午餐', detail: '推荐尝试汤豆腐', done: false },
        { time: '15:00', title: '景点：八坂神社', detail: '夕阳拍摄绝佳位', done: false }
    ];

    return (
        <div className="center-stage" style={{ position: 'relative', height: '100%' }}>
            {/* 顶层透明 Overlay 层级 */}

            {/* 1. 模式切换器 - 始终居中置顶 */}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '4px',
                zIndex: 2000,
                padding: '6px',
                background: 'rgba(5, 5, 6, 0.6)',
                backdropFilter: 'blur(30px)',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                {[
                    { id: 'map', icon: <Map size={15} />, label: '全景地图' },
                    { id: 'studio', icon: <FileText size={15} />, label: '灵感画布' },
                    { id: 'records', icon: <Notebook size={15} />, label: '足迹记录' }
                ].map(view => (
                    <button
                        key={view.id}
                        onClick={() => setCurrentView(view.id)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            background: currentView === view.id ? 'var(--accent-color)' : 'transparent',
                            color: currentView === view.id ? 'white' : 'rgba(255,255,255,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: currentView === view.id ? '0 4px 15px var(--accent-glow)' : 'none'
                        }}
                    >
                        {view.icon} {view.label}
                    </button>
                ))}
            </div>

            {/* 2. 纵向悬浮面板 - 仅在地图模式显示 */}
            <AnimatePresence>
                {currentView === 'map' && (
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: isPanelVisible ? 0 : -320, opacity: 1 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                        style={{
                            position: 'absolute',
                            top: '100px',
                            left: '24px',
                            width: '320px',
                            zIndex: 1000,
                            pointerEvents: 'none'
                        }}
                    >
                        {/* 面板内容主体 */}
                        <div className="glass-card" style={{
                            padding: '24px',
                            background: 'rgba(5, 5, 6, 0.9)',
                            border: '1px solid var(--accent-color)',
                            borderRadius: '24px',
                            pointerEvents: 'auto',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                            position: 'relative'
                        }}>
                            {/* Accent Line */}
                            <div className="premium-gradient" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '3px', borderRadius: '0 0 4px 4px' }} />

                            {/* 标题 & 折叠按钮 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: 'rgba(124, 58, 237, 0.15)', padding: '6px', borderRadius: '8px' }}>
                                        <Calendar size={16} color="var(--accent-color)" />
                                    </div>
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>今日实时行程</span>
                                </div>
                                <button
                                    onClick={() => setIsPanelVisible(false)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.4)', padding: '6px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                            </div>

                            {/* 步骤条内容 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '7px', top: '12px', bottom: '12px', width: '2px', background: 'rgba(255,255,255,0.05)' }} />
                                {todaySteps.map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '18px', position: 'relative' }}>
                                        <div style={{
                                            width: '16px', height: '16px', borderRadius: '50%',
                                            background: step.current ? 'var(--accent-color)' : 'rgba(23, 23, 26, 1)',
                                            border: step.current ? '4px solid rgba(124, 58, 237, 0.3)' : '2px solid rgba(255,255,255,0.1)',
                                            zIndex: 2, flexShrink: 0, marginTop: '2px',
                                            boxShadow: step.current ? '0 0 15px var(--accent-glow)' : 'none'
                                        }} />
                                        <div style={{ flex: 1, opacity: step.done ? 0.4 : 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 700, color: step.current ? 'var(--accent-color)' : 'white' }}>{step.title}</span>
                                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{step.time}</span>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{step.detail}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 底部快捷操作 */}
                            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
                                <button style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '12px', fontWeight: 700, padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}><Zap size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />更轻松</button>
                                <button style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'white', fontSize: '12px', fontWeight: 600, padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}>避雨方案</button>
                            </div>
                        </div>

                        {/* 展开浮标 (当面板隐藏时显示) */}
                        <AnimatePresence>
                            {!isPanelVisible && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => setIsPanelVisible(true)}
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '320px',
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '16px',
                                        background: 'var(--accent-color)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 25px var(--accent-glow)',
                                        pointerEvents: 'auto'
                                    }}
                                >
                                    <ChevronRight size={24} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {currentView === 'map' ? (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <MapContainer center={center} />

                    </motion.div>
                ) : (
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.05), transparent), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.03), transparent)', paddingTop: '90px', overflowY: 'auto' }}
                    >
                        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 60px' }}>
                            {currentView === 'records' ? <TravelRecordsPanel /> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                    {/* Studio Header */}
                                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                            <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '12px', background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>灵感创作画布</h2>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>汇聚全球旅行美学，激发下一次落笔的勇气</p>
                                        </motion.div>
                                    </div>

                                    {/* Canvas Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                        {[
                                            { title: '京都樱花季', color: '#fda4af', tag: '季节限定', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800' },
                                            { title: '极简和风酒店', color: '#94a3b8', tag: '空间美学', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800' },
                                            { title: '深夜食肆指南', color: '#fcd34d', tag: '城市味蕾', img: 'https://images.unsplash.com/photo-1580828343064-f641a1c6543b?w=800' },
                                            { title: '特种兵打卡', color: '#818cf8', tag: '极致效率', img: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=800' },
                                            { title: '自然治愈之旅', color: '#4ade80', tag: '户外呼吸', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800' },
                                            { title: '非遗文化探索', color: '#c084fc', tag: '匠心传承', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800' }
                                        ].map((card, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * idx }}
                                                whileHover={{ y: -10, scale: 1.02 }}
                                                className="glass-card"
                                                style={{
                                                    height: '340px',
                                                    borderRadius: '24px',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    border: '1px solid rgba(255,255,255,0.05)'
                                                }}
                                            >
                                                <img src={card.img} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.8s' }} />
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)' }} />
                                                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                                                    <span style={{ fontSize: '10px', color: card.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px', marginBottom: '12px', display: 'inline-block', border: `1px solid ${card.color}44` }}>{card.tag}</span>
                                                    <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>{card.title}</h4>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Visualizer;
