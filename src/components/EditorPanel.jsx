import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Settings2, Hotel as HotelIcon, Star, Wifi, Coffee, DollarSign, Calendar, ImagePlus, GripVertical } from 'lucide-react';

const EditorPanel = ({ activeData, onUpdate, scenario = 'itinerary', isOpen = true, onToggle, width = 400, onResize }) => {
    const [isResizing, setIsResizing] = useState(false);
    const panelRef = useRef(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const delta = e.clientX - startXRef.current;
            const newWidth = startWidthRef.current + delta;
            onResize(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, onResize]);

    const handleResizeStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        startXRef.current = e.clientX;
        startWidthRef.current = width;
    };

    return (
        <motion.aside
            ref={panelRef}
            className="side-panel"
            initial={false}
            animate={{
                width: isOpen ? `${width}px` : '60px',
                minWidth: isOpen ? `${width}px` : '60px',
                padding: isOpen ? '24px' : '12px'
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            {isOpen ? (
                <>
                    {/* Resize Handle */}
                    <div
                        onMouseDown={handleResizeStart}
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: '8px',
                            cursor: 'ew-resize',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isResizing ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
                        onMouseLeave={(e) => !isResizing && (e.currentTarget.style.background = 'transparent')}
                    >
                        <GripVertical size={14} color="var(--glass-border)" style={{ opacity: isResizing ? 1 : 0.3 }} />
                    </div>

                    {/* Header - clickable to collapse */}
                    <div
                        onClick={onToggle}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '24px',
                            cursor: 'pointer',
                            padding: '8px',
                            margin: '-8px -8px 16px -8px',
                            borderRadius: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <Settings2 size={18} color="var(--accent-color)" />
                        <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                            {scenario === 'itinerary' ? 'AI 行程编辑器' : scenario === 'hotel' ? '酒店筛选器' : '日志编辑器'}
                        </h3>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={scenario}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', flex: 1 }}
                        >
                            {/* Itinerary Scenario */}
                            {scenario === 'itinerary' && (
                                <>
                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>目的地</label>
                                        <div className="glass" style={{ padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <MapPin size={16} color="var(--accent-color)" />
                                            <span style={{ fontSize: '14px' }}>{activeData?.destination || '未选择'}</span>
                                        </div>
                                    </div>

                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>旅行天数</label>
                                        <select
                                            value={activeData?.days || 5}
                                            onChange={(e) => onUpdate({ ...activeData, days: parseInt(e.target.value) })}
                                            style={{
                                                width: '100%',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '12px',
                                                padding: '10px',
                                                color: 'white',
                                                outline: 'none',
                                                fontSize: '14px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value={3}>3 天</option>
                                            <option value={5}>5 天</option>
                                            <option value={7}>7 天</option>
                                        </select>
                                    </div>

                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>酒店等级</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {['经济', '精品', '奢华'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => onUpdate({ ...activeData, hotelTier: type })}
                                                    className="glass"
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px',
                                                        borderRadius: '10px',
                                                        fontSize: '12px',
                                                        color: activeData?.hotelTier === type ? 'var(--accent-color)' : 'white',
                                                        borderColor: activeData?.hotelTier === type ? 'var(--accent-color)' : 'var(--glass-border)',
                                                        background: activeData?.hotelTier === type ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>途经点 ({activeData?.waypoints?.length || 0})</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {(activeData?.waypoints || ['清水寺', '岚山竹林', '伏见稻荷']).map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={{ x: 4 }}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        background: 'rgba(255,255,255,0.03)',
                                                        padding: '10px 12px',
                                                        borderRadius: '10px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    <span>{item}</span>
                                                    <ChevronDown size={14} color="var(--text-secondary)" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Hotel Scenario */}
                            {scenario === 'hotel' && (
                                <>
                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>地区偏好</label>
                                        <select style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '12px',
                                            padding: '10px',
                                            color: 'white',
                                            outline: 'none',
                                            fontSize: '14px'
                                        }}>
                                            <option>京都市中心</option>
                                            <option>岚山地区</option>
                                            <option>祗园周边</option>
                                        </select>
                                    </div>

                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>价格区间 (每晚)</label>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <DollarSign size={14} color="var(--accent-color)" />
                                            <input type="range" min="200" max="2000" defaultValue="800" style={{ flex: 1 }} />
                                            <span style={{ fontSize: '13px', minWidth: '60px', textAlign: 'right' }}>¥800</span>
                                        </div>
                                    </div>

                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>最低评分</label>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {[3, 4, 5].map(rating => (
                                                <button key={rating} className="glass" style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }}>
                                                    <Star size={12} fill="gold" color="gold" />
                                                    {rating}+
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>必备设施</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {[
                                                { icon: <Wifi size={14} />, label: 'WiFi' },
                                                { icon: <Coffee size={14} />, label: '早餐' },
                                                { icon: <HotelIcon size={14} />, label: '温泉' },
                                                { icon: <Star size={14} />, label: '停车' }
                                            ].map(facility => (
                                                <button key={facility.label} className="glass" style={{
                                                    padding: '8px',
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '11px',
                                                    cursor: 'pointer'
                                                }}>
                                                    {facility.icon}
                                                    {facility.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Log Scenario */}
                            {scenario === 'log' && (
                                <>
                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>日期选择</label>
                                        <div className="glass" style={{ padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Calendar size={16} color="var(--accent-color)" />
                                            <span style={{ fontSize: '14px' }}>2026-02-05</span>
                                        </div>
                                    </div>

                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>今日心情</label>
                                        <textarea
                                            placeholder="记录你的旅行感受..."
                                            style={{
                                                width: '100%',
                                                minHeight: '120px',
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '12px',
                                                padding: '12px',
                                                color: 'white',
                                                fontSize: '13px',
                                                outline: 'none',
                                                resize: 'vertical',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                    </div>

                                    <div className="editor-group">
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>添加照片</label>
                                        <button className="glass" style={{
                                            width: '100%',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            border: '2px dashed var(--glass-border)'
                                        }}>
                                            <ImagePlus size={24} color="var(--text-secondary)" />
                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>点击上传照片</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        <button className="glass" style={{ width: '100%', padding: '12px', borderRadius: '12px', color: 'white', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                            {scenario === 'itinerary' ? '重新生成建议' : scenario === 'hotel' ? '开始搜索' : '保存日志'}
                        </button>
                    </div>
                </>
            ) : (
                // Collapsed state - entire area clickable
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                        gap: '20px',
                        cursor: 'pointer'
                    }}
                    onClick={onToggle}
                >
                    <Settings2 size={20} color="var(--accent-color)" />
                    <div style={{
                        writingMode: 'vertical-rl',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        letterSpacing: '0.1em',
                        fontWeight: 500
                    }}>
                        {scenario === 'itinerary' ? '行程编辑器' : scenario === 'hotel' ? '酒店筛选' : '日志编辑'}
                    </div>
                </div>
            )}
        </motion.aside>
    );
};

export default EditorPanel;
