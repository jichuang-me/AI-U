import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


import MapContainer from './MapContainer';
import TravelRecordsPanel from './TravelRecordsPanel';
import { Map, FileText, Notebook, Image, Download, Share2, Grid, ListChecks, Calendar, Navigation, Zap, Clock, MapPin, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

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
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 2000,
                padding: '4px',
                background: 'rgba(12, 12, 14, 0.4)',
                backdropFilter: 'blur(30px)',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)'
            }}>
                {[
                    { id: 'map', icon: <Map size={14} />, label: '地图' },
                    { id: 'studio', icon: <FileText size={14} />, label: '创作' },
                    { id: 'records', icon: <Notebook size={14} />, label: '记录' }
                ].map(view => (
                    <button
                        key={view.id}
                        onClick={() => setCurrentView(view.id)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: currentView === view.id ? 'var(--accent-color)' : 'transparent',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
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
                        animate={{ x: isPanelVisible ? 0 : -280, opacity: 1 }}
                        transition={{ type: 'spring', damping: 20 }}
                        style={{
                            position: 'absolute',
                            top: '80px',
                            left: '24px',
                            width: '300px',
                            zIndex: 1000,
                            pointerEvents: 'none' // 让层级下的点击穿透，内部元素再开启可点
                        }}
                    >
                        {/* 面板内容主体 */}
                        <div className="glass-card" style={{
                            padding: '20px',
                            background: 'rgba(12, 12, 14, 0.9)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '20px',
                            pointerEvents: 'auto',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                            position: 'relative'
                        }}>
                            {/* 标题 & 折叠按钮 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={16} color="var(--accent-color)" />
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>今日计划 · Step by Step</span>
                                </div>
                                <button
                                    onClick={() => setIsPanelVisible(false)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                            </div>

                            {/* 步骤条内容 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.05)' }} />
                                {todaySteps.map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', opacity: step.done ? 0.5 : 1 }}>
                                        <div style={{
                                            width: '16px', height: '16px', borderRadius: '50%',
                                            background: step.current ? 'var(--accent-color)' : step.done ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                                            border: step.current ? '4px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--glass-border)',
                                            zIndex: 2, flexShrink: 0
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: step.current ? 'var(--accent-color)' : 'white' }}>{step.title}</span>
                                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{step.time}</span>
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{step.detail}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 底部快捷操作 */}
                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--glass-border)', display: 'flex', gap: '8px' }}>
                                <button style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: '#10b981', fontSize: '11px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Zap size={12} style={{ marginRight: '4px' }} />更轻松</button>
                                <button style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: 'white', fontSize: '11px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>避雨方案</button>
                            </div>
                        </div>

                        {/* 展开浮标 (当面板隐藏时显示) */}
                        {!isPanelVisible && (
                            <button
                                onClick={() => setIsPanelVisible(true)}
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '280px', // 抵消外层 motion 偏移
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'var(--accent-color)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                    pointerEvents: 'auto'
                                }}
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ width: '100%', height: '100%', background: 'var(--bg-color)', paddingTop: '80px', overflowY: 'auto' }}
                    >
                        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 40px' }}>
                            {currentView === 'records' ? <TravelRecordsPanel /> : (
                                <div style={{ height: '500px', width: '100%', border: '1px dashed var(--glass-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                    创作画布已就绪
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
