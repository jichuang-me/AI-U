import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { callAIService } from '../services/aiService';
import {
    X, MapPin, Calendar, Hotel, DollarSign, Star, GripVertical,
    Sparkles, Image as ImageIcon, FileText, Upload, Plus,
    Navigation, Clock, CheckCircle2, MoreVertical, Trash2
} from 'lucide-react';

const PlanningModal = ({ id, isOpen, onClose, data, onUpdate, modalState, onModalUpdate, onFocus, aiConfig }) => {
    const [formData, setFormData] = useState(data || {});
    const [isAIGenerating, setIsAIGenerating] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    // Sync formData with incoming data
    useEffect(() => {
        if (data) setFormData(data);
    }, [data]);

    const position = { x: modalState?.x || 100, y: modalState?.y || 100 };
    const size = { width: modalState?.width || 550, height: modalState?.height || 650 };
    const zIndex = modalState?.zIndex || 1000;

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const modalRef = useRef(null);


    // 拖动处理
    const handleDragStart = (e) => {
        if (e.target.closest('.modal-header')) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleDragMove = useCallback((e) => {
        if (isDragging) {
            onModalUpdate({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    }, [isDragging, dragStart, onModalUpdate]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // 调整大小处理
    const handleResizeStart = (e) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        });
    };

    const handleResizeMove = useCallback((e) => {
        if (isResizing) {
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;
            onModalUpdate({
                width: Math.max(400, resizeStart.width + deltaX),
                height: Math.max(400, resizeStart.height + deltaY)
            });
        }
    }, [isResizing, resizeStart, onModalUpdate]);

    const handleResizeEnd = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
            document.body.style.cursor = 'move';
            document.body.style.userSelect = 'none';
            return () => {
                document.removeEventListener('mousemove', handleDragMove);
                document.removeEventListener('mouseup', handleDragEnd);
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            };
        }
    }, [isDragging, handleDragMove, handleDragEnd]);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeEnd);
            document.body.style.cursor = 'nwse-resize';
            document.body.style.userSelect = 'none';
            return () => {
                document.removeEventListener('mousemove', handleResizeMove);
                document.removeEventListener('mouseup', handleResizeEnd);
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            };
        }
    }, [isResizing, handleResizeMove, handleResizeEnd]);

    const handleSubmit = () => {
        onUpdate(formData);
        onClose();
    };

    const handleAICreate = async (type) => {
        if (!formData.prompt) return;
        setIsAIGenerating(true);
        try {
            const command = type === 'image'
                ? `根据以下描述生成一张精美的风景/氛围草图建议，并给出配色方案：${formData.prompt}`
                : `帮我撰写一段关于这趟旅程的灵感文字：${formData.prompt}`;

            const response = await callAIService(command, aiConfig, { activePlan: formData, scenario: 'creation' });
            setAiResult(response);
            // Auto-update content if it's text
            if (type === 'text') {
                setFormData(prev => ({ ...prev, output: response }));
            }
        } catch (error) {
            console.error("AI Creation Error:", error);
            setAiResult("Creation Failed: " + error.message);
        } finally {
            setIsAIGenerating(false);
        }
    };

    const getFieldMeta = (key) => {
        const meta = {
            destination: { label: '目的地', icon: <MapPin size={12} /> },
            days: { label: '计划天数', icon: <Clock size={12} /> },
            hotelTier: { label: '住宿等级', icon: <Hotel size={12} /> },
            region: { label: '区域偏好', icon: <Navigation size={12} /> },
            budget: { label: '预估预算', icon: <DollarSign size={12} /> },
            rating: { label: '满意度阈值', icon: <Star size={12} /> },
            date: { label: '出发日期', icon: <Calendar size={12} /> },
            mood: { label: '当前心境', icon: <Star size={12} /> },
            content: { label: '日志正文', icon: <FileText size={12} /> },
            guestCount: { label: '出行人数', icon: <Plus size={12} /> },
            transport: { label: '交通工具', icon: <Navigation size={12} /> }
        };
        return meta[key] || { label: key, icon: <MoreVertical size={12} /> };
    };

    const dashboardLabelStyle = {
        display: 'block',
        fontSize: '9px',
        fontWeight: 800,
        color: 'rgba(255,255,255,0.4)',
        marginBottom: '8px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
    };

    const dashboardInputStyle = {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.03)',
        color: 'white',
        fontSize: '13px',
        fontWeight: 600,
        outline: 'none',
        transition: '0.2s'
    };

    const tinyBtnStyle = {
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'white',
        fontSize: '11px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: '0.2s'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 半透明背景，但不阻止交互 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 999,
                            pointerEvents: 'none' // 允许点击穿透到下层
                        }}
                    />

                    {/* Modal - Pure Absolute Coordinate Strategy */}
                    <motion.div
                        ref={modalRef}
                        onMouseDown={onFocus}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card"
                        style={{
                            position: 'fixed',
                            top: position.y,
                            left: position.x,
                            width: size.width,
                            height: size.height,
                            zIndex: zIndex,
                            display: 'flex',
                            flexDirection: 'column',
                            pointerEvents: 'auto',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            borderRadius: '28px',
                            background: 'rgba(18, 18, 22, 0.85)',
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}
                    >
                        {/* Header - Drag Handle */}
                        <div
                            className="modal-header"
                            onMouseDown={handleDragStart}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 20px',
                                borderBottom: '1px solid var(--glass-border)',
                                cursor: isDragging ? 'move' : 'grab',
                                userSelect: 'none',
                                background: 'rgba(255,255,255,0.02)',
                                borderTopLeftRadius: '28px',
                                borderTopRightRadius: '28px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="premium-gradient" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
                                <h2 style={{ fontSize: '14px', fontWeight: 800, color: 'white', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    {id === 'itinerary' ? 'Intelligent Route Engine' :
                                        id === 'hotel' ? 'Lodging Consensus' :
                                            id === 'creation' ? 'Creative Studio' : 'Voyage Archive'}
                                </h2>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'}>
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                            {/* 1. ROUTE PLANNING SPECIAL UI */}
                            {id === 'itinerary' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                                        <div>
                                            <label style={dashboardLabelStyle}>TARGET DESTINATION</label>
                                            <input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} style={dashboardInputStyle} />
                                        </div>
                                        <div>
                                            <label style={dashboardLabelStyle}>DURATION (DAYS)</label>
                                            <input type="number" value={formData.days} onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })} style={dashboardInputStyle} />
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <label style={{ ...dashboardLabelStyle, marginBottom: 0 }}>WAYPOINT CHRONOLOGY</label>
                                            <button className="glass" style={{ ...tinyBtnStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Sparkles size={12} /> AI Optimize
                                            </button>
                                        </div>
                                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '12px' }}>
                                            <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '10px', width: '2px', background: 'rgba(124, 58, 237, 0.2)' }} />
                                            {(formData.waypoints || []).map((wp, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-glow)', zIndex: 1 }} />
                                                    <div style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '13px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {wp}
                                                        <Trash2 size={14} style={{ opacity: 0.3, cursor: 'pointer' }} />
                                                    </div>
                                                </div>
                                            ))}
                                            <button style={{ ...dashboardInputStyle, borderStyle: 'dashed', textAlign: 'center', color: 'rgba(255,255,255,0.4)', background: 'transparent' }}>
                                                + ADD NEW WAYPOINT
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. CREATION MODE SPECIAL UI */}
                            {id === 'creation' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    <section>
                                        <label style={dashboardLabelStyle}>MULTIMODAL PROMPT</label>
                                        <textarea
                                            value={formData.prompt}
                                            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                            placeholder="向 AI 描述您的创作意图... (例如: '帮我润色京都游记' 或 '生成一张金阁寺雪景图')"
                                            style={{ ...dashboardInputStyle, height: '140px', resize: 'none', lineHeight: '1.6' }}
                                        />
                                    </section>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <button
                                            className="glass"
                                            onClick={() => handleAICreate('image')}
                                            disabled={isAIGenerating}
                                            style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', border: '1px solid rgba(124, 58, 237, 0.3)', background: 'rgba(124, 58, 237, 0.05)', position: 'relative', overflow: 'hidden' }}
                                        >
                                            {isAIGenerating && <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--accent-color)' }} />}
                                            <ImageIcon size={24} color="var(--accent-color)" />
                                            <span style={{ fontSize: '12px', fontWeight: 700 }}>AI 图片创作</span>
                                        </button>
                                        <button
                                            className="glass"
                                            onClick={() => handleAICreate('text')}
                                            disabled={isAIGenerating}
                                            style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)', position: 'relative', overflow: 'hidden' }}
                                        >
                                            <FileText size={24} color="#10b981" />
                                            <span style={{ fontSize: '12px', fontWeight: 700 }}>AI 文档撰写</span>
                                        </button>
                                    </div>

                                    {aiResult && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124, 58, 237, 0.2)', fontSize: '12px', lineHeight: 1.6, color: '#ddd', whiteSpace: 'pre-line' }}>
                                            <div style={{ color: 'var(--accent-color)', fontWeight: 800, marginBottom: '8px', fontSize: '10px' }}>AI GENERATION RESULT</div>
                                            {aiResult}
                                        </motion.div>
                                    )}

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="glass" style={{ flex: 1, padding: '12px', borderRadius: '14px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <Upload size={14} /> 上传本地图片
                                        </button>
                                        <button className="glass" style={{ flex: 1, padding: '12px', borderRadius: '14px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <Upload size={14} /> 导入参考文档
                                        </button>
                                    </div>

                                    <div style={{ marginTop: 'auto', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700 }}>
                                            <Clock size={12} /> RECENT GENERATIONS
                                        </div>
                                        <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                                            暂无历史记录，开始您的第一次创作吧
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. DYNAMIC FALLBACK (FOR LOG/HOTEL) */}
                            {id !== 'itinerary' && id !== 'creation' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '20px'
                                }}>
                                    {Object.entries(formData || {}).map(([key, value]) => {
                                        if (key === 'waypoints') return null;
                                        const isWide = key === 'content' || key === 'description' || key === 'mood';
                                        const meta = getFieldMeta(key);

                                        return (
                                            <div key={key} style={{ gridColumn: isWide ? 'span 2' : 'span 1' }}>
                                                <label style={dashboardLabelStyle}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span style={{ color: 'var(--accent-color)' }}>{meta.icon}</span>
                                                        {meta.label}
                                                    </span>
                                                </label>

                                                {key === 'content' || key === 'mood' ? (
                                                    <textarea
                                                        value={value}
                                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                        rows={key === 'content' ? 10 : 3}
                                                        className="glass"
                                                        style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px', outline: 'none', resize: 'none', transition: '0.2s', lineHeight: '1.6' }}
                                                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                                                        onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                                                    />
                                                ) : key === 'rating' ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        {[3, 4, 5].map(r => (
                                                            <button key={r} onClick={() => setFormData({ ...formData, [key]: r })} className="glass" style={{ flex: 1, padding: '10px', borderRadius: '12px', border: `1px solid ${value === r ? 'var(--accent-color)' : 'var(--glass-border)'}`, background: value === r ? 'rgba(124, 58, 237, 0.1)' : 'transparent', color: value === r ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{r}★</button>
                                                        ))}
                                                    </div>
                                                ) : key === 'hotelTier' ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        {['经济', '精品', '奢华'].map(t => (
                                                            <button key={t} onClick={() => setFormData({ ...formData, [key]: t })} className="glass" style={{ flex: 1, padding: '10px', borderRadius: '12px', border: `1px solid ${value === t ? 'var(--accent-color)' : 'var(--glass-border)'}`, background: value === t ? 'rgba(124, 58, 237, 0.1)' : 'transparent', color: value === t ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>{t}</button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type={typeof value === 'number' ? 'number' : key === 'date' ? 'date' : 'text'}
                                                        value={value}
                                                        onChange={(e) => setFormData({ ...formData, [key]: typeof value === 'number' ? parseInt(e.target.value) : e.target.value })}
                                                        className="glass"
                                                        style={dashboardInputStyle}
                                                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                                                        onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            padding: '16px 24px',
                            borderTop: '1px solid var(--glass-border)',
                            justifyContent: 'flex-end',
                            background: 'rgba(255,255,255,0.01)'
                        }}>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'var(--accent-color)',
                                    color: 'white',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                确认
                            </button>
                        </div>

                        {/* Resize Handle */}
                        <div
                            onMouseDown={handleResizeStart}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: '20px',
                                height: '20px',
                                cursor: 'nwse-resize',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.5
                            }}
                        >
                            <GripVertical size={14} style={{ transform: 'rotate(45deg)' }} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PlanningModal;
