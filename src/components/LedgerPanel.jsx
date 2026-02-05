import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowDownRight, GripVertical } from 'lucide-react';

const LedgerPanel = ({ activePlan, isOpen = true, onToggle, width = 400, onResize }) => {
    const [isResizing, setIsResizing] = useState(false);
    const panelRef = useRef(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const delta = startXRef.current - e.clientX; // Reversed for right panel
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

    // Dynamic budget calculation based on plan
    const calculateBudget = () => {
        if (!activePlan) return { total: 0, breakdown: [] };

        const days = activePlan.days || 5;
        const tier = activePlan.hotelTier || '精品';

        // Price per night based on tier
        const hotelPricePerNight = tier === '奢华' ? 1500 : tier === '精品' ? 800 : 400;
        const accommodation = hotelPricePerNight * days;

        // Transportation estimate
        const transportation = days * 200;

        // Food and tickets estimate  
        const foodAndTickets = days * 300;

        const total = accommodation + transportation + foodAndTickets;

        return {
            total,
            breakdown: [
                { label: '住宿', amount: accommodation, percent: Math.round((accommodation / total) * 100), color: 'var(--accent-color)' },
                { label: '交通', amount: transportation, percent: Math.round((transportation / total) * 100), color: '#f59e0b' },
                { label: '餐饮/门票', amount: foodAndTickets, percent: Math.round((foodAndTickets / total) * 100), color: '#10b981' }
            ]
        };
    };

    const budget = calculateBudget();

    return (
        <motion.aside
            ref={panelRef}
            className="side-panel right"
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
                            left: 0,
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
                        <Wallet size={18} color="var(--accent-color)" />
                        <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>实时旅行账本</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Total Budget Card */}
                        <div className="glass" style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>预计总支出</div>
                            <div style={{ fontSize: '24px', fontWeight: 700 }}>¥ {budget.total.toLocaleString()}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', fontSize: '11px', color: '#22c55e' }}>
                                <ArrowDownRight size={14} />
                                <span>比类似行程节省 15%</span>
                            </div>
                        </div>

                        {/* Expense Categories */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>费用分布</label>
                            {budget.breakdown.map((cat) => (
                                <div key={cat.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                        <span>{cat.label}</span>
                                        <span style={{ fontWeight: 500 }}>¥ {cat.amount.toLocaleString()}</span>
                                    </div>
                                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                        <div style={{ width: `${cat.percent}%`, height: '100%', background: cat.color, borderRadius: '2px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Savings Tips */}
                        <div className="glass" style={{ padding: '16px', borderRadius: '12px', marginTop: '20px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '8px' }}>
                                <TrendingUp size={16} />
                                <span style={{ fontSize: '12px', fontWeight: 600 }}>省钱策略</span>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {activePlan?.hotelTier === '奢华'
                                    ? '选择精品酒店可节省 ¥' + ((1500 - 800) * (activePlan?.days || 5)).toLocaleString()
                                    : 'AI 监测到周二入住可额外减免 ¥200，已自动优化。'}
                            </p>
                        </div>
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
                    <Wallet size={20} color="var(--accent-color)" />
                    <div style={{
                        writingMode: 'vertical-rl',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        letterSpacing: '0.1em',
                        fontWeight: 500
                    }}>
                        旅行账本
                    </div>
                </div>
            )}
        </motion.aside>
    );
};

export default LedgerPanel;
