import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, GripVertical, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

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

    // 计算总计
    const calculateTotals = () => {
        let totalBudget = 0;
        let totalActual = 0;

        Object.values(budgetData).forEach(category => {
            category.items.forEach(item => {
                totalBudget += item.budget;
                totalActual += item.actual;
            });
        });

        return { totalBudget, totalActual };
    };

    const { totalBudget, totalActual } = calculateTotals();
    const savings = totalBudget - totalActual;
    const savingsPercent = ((savings / totalBudget) * 100).toFixed(1);

    // 优化建议
    const suggestions = [
        '选择周二入住可节省 ¥200',
        '提前30天预订机票可节省15%',
        '使用信用卡积分兑换酒店',
        '避开节假日高峰期出行'
    ];

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

                    {/* Header */}
                    <div
                        onClick={onToggle}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '20px',
                            cursor: 'pointer',
                            padding: '8px',
                            margin: '-8px -8px 12px -8px',
                            borderRadius: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <Wallet size={18} color="var(--accent-color)" />
                        <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>账本</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
                        {/* 总览卡片 */}
                        <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>预算</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700 }}>¥{totalBudget.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>实际</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>¥{totalActual.toLocaleString()}</div>
                                </div>
                            </div>
                            <div style={{ padding: '6px 10px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px', fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <TrendingUp size={12} />
                                已节省 ¥{savings.toLocaleString()} ({savingsPercent}%)
                            </div>
                        </div>

                        {/* 详细分类 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.entries(budgetData).map(([key, category]) => {
                                const categoryBudget = category.items.reduce((sum, item) => sum + item.budget, 0);
                                const categoryActual = category.items.reduce((sum, item) => sum + item.actual, 0);
                                const isExpanded = expandedCategory === key;

                                return (
                                    <div key={key} className="glass" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                        {/* Category Header */}
                                        <div
                                            onClick={() => setExpandedCategory(isExpanded ? null : key)}
                                            style={{
                                                padding: '12px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span style={{ fontSize: '18px' }}>{category.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>{category.category}</div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                                    ¥{categoryActual.toLocaleString()} / ¥{categoryBudget.toLocaleString()}
                                                </div>
                                            </div>
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>

                                        {/* Category Items */}
                                        {isExpanded && (
                                            <div style={{ borderTop: '1px solid var(--glass-border)', padding: '8px 12px', background: 'rgba(0,0,0,0.2)' }}>
                                                {category.items.map((item, idx) => (
                                                    <div key={idx} style={{ padding: '8px 0', borderBottom: idx < category.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                            <span style={{ fontSize: '11px' }}>{item.name}</span>
                                                            {item.note && <span style={{ fontSize: '10px', color: '#22c55e' }}>{item.note}</span>}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '8px', fontSize: '10px' }}>
                                                            <span style={{ color: 'var(--text-secondary)' }}>预算: ¥{item.budget}</span>
                                                            <span style={{ color: item.actual <= item.budget ? '#22c55e' : '#ef4444' }}>
                                                                实际: ¥{item.actual}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* 优化建议 */}
                        <div className="glass" style={{ padding: '14px', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                                <Lightbulb size={14} color="var(--accent-color)" />
                                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-color)' }}>优化建议</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {suggestions.map((suggestion, idx) => (
                                    <div key={idx} style={{
                                        fontSize: '10px',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.4,
                                        paddingLeft: '10px',
                                        position: 'relative'
                                    }}>
                                        <span style={{ position: 'absolute', left: 0, color: 'var(--accent-color)' }}>•</span>
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
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
                        账本
                    </div>
                </div>
            )}
        </motion.aside>
    );
};

export default BudgetPanel;
