import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wallet, TrendingUp, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const BudgetPanel = ({ activePlan, isOpen = true, onToggle, width = 300, onResize }) => {
    const [isResizing, setIsResizing] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const panelRef = useRef(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const delta = startXRef.current - e.clientX;
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

    // 详细预算数据
    const budgetData = {
        accommodation: {
            category: '住宿',
            icon: '🏨',
            color: 'var(--accent-color)',
            items: [
                { name: '京都四季酒店', budget: 2800, actual: 2650, nights: 2 },
                { name: '岚山温泉旅馆', budget: 1500, actual: 1500, nights: 2 },
                { name: '祗园民宿', budget: 800, actual: 750, nights: 1 }
            ]
        },
        transportation: {
            category: '交通',
            icon: '🚄',
            color: '#f59e0b',
            items: [
                { name: '租车费用', budget: 600, actual: 580 },
                { name: 'JR Pass', budget: 400, actual: 400 },
                { name: '市内公交', budget: 200, actual: 180 }
            ]
        },
        dining: {
            category: '餐饮',
            icon: '🍜',
            color: '#10b981',
            items: [
                { name: '怀石料理 - 菊乃井', budget: 800, actual: 850 },
                { name: '拉面小路', budget: 150, actual: 120 },
                { name: '锦市场小吃', budget: 300, actual: 280 },
                { name: '咖啡厅', budget: 200, actual: 170 }
            ]
        },
        tickets: {
            category: '门票',
            icon: '🎫',
            color: '#ec4899',
            items: [
                { name: '清水寺', budget: 80, actual: 80 },
                { name: '金阁寺', budget: 100, actual: 100 },
                { name: '伏见稻荷', budget: 0, actual: 0, note: '免费' },
                { name: '二条城', budget: 120, actual: 120 }
            ]
        },
        shopping: {
            category: '购物',
            icon: '🛍️',
            color: '#8b5cf6',
            items: [
                { name: '和服纪念品', budget: 500, actual: 450 },
                { name: '抹茶制品', budget: 300, actual: 280 },
                { name: '手工艺品', budget: 200, actual: 150 }
            ]
        },
        other: {
            category: '其他',
            icon: '💰',
            color: '#6366f1',
            items: [
                { name: '小费', budget: 200, actual: 150 },
                { name: '应急备用金', budget: 300, actual: 200 }
            ]
        }
    };

    // Calculate dynamic budget based on activePlan
    const calculateDynamicTotals = () => {
        const days = activePlan?.days || 5;
        const tier = activePlan?.hotelTier || '精品';

        // Price per night based on tier - synced with LedgerPanel logic
        const hotelPriceMap = { '奢华': 2800, '精品': 1200, '经济': 600 };
        const foodPriceMap = { '奢华': 800, '精品': 400, '经济': 200 };

        const accommodationTotal = hotelPriceMap[tier] * days;
        const foodTotal = foodPriceMap[tier] * days;
        const transportTotal = days * 200; // Average base
        const activityTotal = days * 150; // Average base

        const totalBudget = accommodationTotal + foodTotal + transportTotal + activityTotal;
        // Mock actual as slightly less than budget for premium positive feedback
        const totalActual = Math.floor(totalBudget * 0.92);

        return {
            totalBudget,
            totalActual,
            accommodationTotal,
            foodTotal,
            transportTotal,
            activityTotal
        };
    };

    const {
        totalBudget,
        totalActual,
        accommodationTotal,
        foodTotal,
        transportTotal,
        activityTotal
    } = calculateDynamicTotals();

    const savings = totalBudget - totalActual;
    const savingsPercent = ((savings / totalBudget) * 100).toFixed(1);

    // Optimized suggestions based on current plan
    const suggestions = [
        activePlan?.hotelTier === '奢华' ? '选择精品酒店可节省 ¥' + ((2800 - 1200) * (activePlan?.days || 5)).toLocaleString() : '当前酒店方案已是平衡首选',
        '选择周二入住可额外节省约 ¥200',
        '提前30天预订热门餐厅可避免排队费',
        '使用 JR Pass 周游券可覆盖 80% 交通费'
    ];

    return (
        <motion.aside
            ref={panelRef}
            className="side-panel right"
            initial={false}
            animate={{
                width: isOpen ? `${width}px` : '70px',
                minWidth: isOpen ? `${width}px` : '70px',
                padding: isOpen ? '24px' : '12px'
            }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            style={{ position: 'relative', overflow: 'hidden', borderLeft: '1px solid var(--border-color)', background: 'rgba(5, 5, 6, 0.6)', backdropFilter: 'blur(40px)' }}
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
                            width: '4px',
                            cursor: 'ew-resize',
                            zIndex: 100,
                            transition: '0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-color)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    />

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="premium-gradient" style={{ width: '4px', height: '14px', borderRadius: '2px' }} />
                            <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>财务预算</h3>
                        </div>
                        <button onClick={onToggle} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.4)', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}><Wallet size={14} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
                        {/* 总览卡片 */}
                        <div className="glass-card" style={{ padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>预期总额</div>
                                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>¥{totalBudget.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>实时结算</div>
                                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>¥{totalActual.toLocaleString()}</div>
                                </div>
                            </div>
                            <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                <TrendingUp size={14} />
                                节省 ¥{savings.toLocaleString()} ({savingsPercent}%)
                            </div>
                        </div>

                        {/* 详细分类 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {Object.entries(budgetData).map(([key, category]) => {
                                const isExpanded = expandedCategory === key;
                                const currentAmount =
                                    key === 'accommodation' ? accommodationTotal :
                                        key === 'dining' ? foodTotal :
                                            key === 'transportation' ? transportTotal :
                                                (activityTotal / 3); // Split remaining activities

                                return (
                                    <div key={key} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', transition: 'var(--transition)', background: isExpanded ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                                        {/* Category Header */}
                                        <div
                                            onClick={() => setExpandedCategory(isExpanded ? null : key)}
                                            style={{
                                                padding: '14px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                            }}
                                            onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                            onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <div style={{ fontSize: '20px', width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{category.icon}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px', color: 'white' }}>{category.category}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                                    ¥{currentAmount.toLocaleString()} <span style={{ opacity: 0.3 }}>/</span> ¥{currentAmount.toLocaleString()}
                                                </div>
                                            </div>
                                            <div style={{ color: 'rgba(255,255,255,0.2)' }}>{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                                        </div>

                                        {/* Category Items */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                                    <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px 14px', background: 'rgba(0,0,0,0.15)' }}>
                                                        {category.items.map((item, idx) => (
                                                            <div key={idx} style={{ padding: '10px 0', borderBottom: idx < category.items.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                                                                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{item.name}</span>
                                                                    {item.note && <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{item.note}</span>}
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                                                                        <span>预算: ¥{item.budget}</span>
                                                                    </div>
                                                                    <span style={{ fontSize: '12px', fontWeight: 700, color: item.actual <= item.budget ? '#10b981' : '#ef4444' }}>
                                                                        ¥{item.actual}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 优化建议 */}
                        <div style={{ padding: '16px', borderRadius: '16px', border: '1px dashed rgba(124, 58, 237, 0.3)', background: 'rgba(124, 58, 237, 0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <div style={{ padding: '4px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '6px' }}>
                                    <Lightbulb size={14} color="var(--accent-color)" />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI 优化建议</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {suggestions.map((suggestion, idx) => (
                                    <div key={idx} style={{
                                        fontSize: '11px',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.5,
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-color)', marginTop: '6px', flexShrink: 0 }} />
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', cursor: 'pointer', gap: '16px' }} onClick={onToggle}>
                    <div className="premium-gradient" style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px var(--accent-glow)' }}>
                        <Wallet size={20} color="white" />
                    </div>
                    <div style={{ writingMode: 'vertical-rl', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.2em' }}>财务预算</div>
                </div>
            )}
        </motion.aside>
    );
};

export default BudgetPanel;
