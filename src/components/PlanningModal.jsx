import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Hotel, DollarSign, Star, GripVertical } from 'lucide-react';

const PlanningModal = ({ isOpen, onClose, scenario, activePlan, onUpdate }) => {
    const [formData, setFormData] = useState(activePlan || {
        destination: '',
        days: 5,
        hotelTier: '精品',
        waypoints: []
    });

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 600, height: 600 });
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

    const handleDragMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

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

    const handleResizeMove = (e) => {
        if (isResizing) {
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;
            setSize({
                width: Math.max(400, resizeStart.width + deltaX),
                height: Math.max(400, resizeStart.height + deltaY)
            });
        }
    };

    const handleResizeEnd = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
            document.body.style.cursor = 'move';
            document.body.style.userSelect = 'none';
        }
        return () => {
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        };
    }, [isDragging, dragStart, position]);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeEnd);
            document.body.style.cursor = 'nwse-resize';
            document.body.style.userSelect = 'none';
        }
        return () => {
            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', handleResizeEnd);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        };
    }, [isResizing, resizeStart]);

    // 监听 activePlan 变化，自动更新表单
    useEffect(() => {
        if (activePlan) {
            setFormData(activePlan);
        }
    }, [activePlan]);

    const handleSubmit = () => {
        onUpdate(formData);
        onClose();
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

                    {/* Modal */}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-card"
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                            width: `${size.width}px`,
                            height: `${size.height}px`,
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column',
                            pointerEvents: 'auto' // Modal 本身可以交互
                        }}
                    >
                        {/* Header - 可拖动 */}
                        <div
                            className="modal-header"
                            onMouseDown={handleDragStart}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '20px 24px',
                                borderBottom: '1px solid var(--glass-border)',
                                cursor: isDragging ? 'move' : 'grab',
                                userSelect: 'none'
                            }}
                        >
                            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>
                                {scenario === 'itinerary' ? '规划行程' : scenario === 'hotel' ? '酒店筛选' : '旅行日志'}
                            </h2>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white'
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content - 可滚动 */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {scenario === 'itinerary' && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                                <MapPin size={13} style={{ display: 'inline', marginRight: '6px' }} />
                                                目的地
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.destination || ''}
                                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                                placeholder="例如：京都、东京、大阪..."
                                                className="glass"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--glass-border)',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: 'white',
                                                    fontSize: '13px',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                                <Calendar size={13} style={{ display: 'inline', marginRight: '6px' }} />
                                                旅行天数
                                            </label>
                                            <select
                                                value={formData.days || 5}
                                                onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                                                className="glass"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--glass-border)',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: 'white',
                                                    fontSize: '13px',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {[3, 5, 7, 10, 14].map(day => (
                                                    <option key={day} value={day}>{day} 天</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                                <Hotel size={13} style={{ display: 'inline', marginRight: '6px' }} />
                                                酒店等级
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                                {['经济', '精品', '奢华'].map(tier => (
                                                    <button
                                                        key={tier}
                                                        onClick={() => setFormData({ ...formData, hotelTier: tier })}
                                                        className="glass"
                                                        style={{
                                                            padding: '10px',
                                                            borderRadius: '10px',
                                                            border: `2px solid ${formData.hotelTier === tier ? 'var(--accent-color)' : 'var(--glass-border)'}`,
                                                            background: formData.hotelTier === tier ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                                                            color: formData.hotelTier === tier ? 'var(--accent-color)' : 'white',
                                                            fontSize: '13px',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {tier}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {scenario === 'hotel' && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                                地区偏好
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="例如：市中心、景区附近..."
                                                className="glass"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--glass-border)',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: 'white',
                                                    fontSize: '13px',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                                                <DollarSign size={13} style={{ display: 'inline', marginRight: '6px' }} />
                                                价格区间 (每晚)
                                            </label>
                                            <input
                                                type="range"
                                                min="200"
                                                max="2000"
                                                defaultValue="800"
                                                style={{ width: '100%' }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                                                <span>¥200</span>
                                                <span>¥2000</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                                <Star size={13} style={{ display: 'inline', marginRight: '6px' }} />
                                                最低评分
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                                {[3, 4, 5].map(rating => (
                                                    <button
                                                        key={rating}
                                                        className="glass"
                                                        style={{
                                                            padding: '10px',
                                                            borderRadius: '10px',
                                                            border: '1px solid var(--glass-border)',
                                                            background: 'rgba(255,255,255,0.05)',
                                                            color: 'white',
                                                            fontSize: '13px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        <Star size={13} fill="gold" color="gold" />
                                                        {rating}+
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {scenario === 'log' && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                                日期
                                            </label>
                                            <input
                                                type="date"
                                                className="glass"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--glass-border)',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: 'white',
                                                    fontSize: '13px',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                                今日心情
                                            </label>
                                            <textarea
                                                placeholder="记录你的旅行感受..."
                                                rows={8}
                                                className="glass"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--glass-border)',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: 'white',
                                                    fontSize: '13px',
                                                    outline: 'none',
                                                    resize: 'vertical',
                                                    fontFamily: 'inherit'
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            padding: '16px 24px',
                            borderTop: '1px solid var(--glass-border)',
                            justifyContent: 'flex-end'
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
