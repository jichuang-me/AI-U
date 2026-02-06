import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Hotel, BookOpen, UtensilsCrossed, Star, TrendingUp, Heart, RotateCcw } from 'lucide-react';

const RecommendationsPanel = ({ isOpen = true, onToggle, width = 300, onResize }) => {
    const [isResizing, setIsResizing] = React.useState(false);
    const startXRef = React.useRef(0);
    const startWidthRef = React.useRef(0);

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const delta = e.clientX - startXRef.current;
            const newWidth = startWidthRef.current + delta;
            onResize(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
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

    // 增强模拟数据 - 带图片预览
    const attractions = [
        { name: '清水寺', rating: 4.8, visitors: '1.2M', summary: '京都最古老的寺院之一，俯瞰全城。', price: '免费', img: 'https://images.unsplash.com/photo-1624235113938-47f116e538f7?w=200&h=200&fit=crop' },
        { name: '伏见稻荷', rating: 4.9, visitors: '980K', summary: '千本鸟居，京都的标志性景观。', price: '免费', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
    ];

    const hotels = [
        { name: '京都四季酒店', price: '¥2,800', rating: 4.9, summary: '位于 800 年历史园林中，极致奢华。', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200&h=200&fit=crop' },
        { name: '祗园精品旅馆', price: '¥980', rating: 4.6, summary: '传统町屋风格，身处祗园核心。', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop' },
    ];

    const restaurants = [
        { name: '菊乃井', cuisine: '怀石料理', price: '¥800', rating: 4.9, summary: '米其林三星，正宗京都风味。', img: 'https://images.unsplash.com/photo-1580828343064-f641a1c6543b?w=200&h=200&fit=crop' },
        { name: '一兰拉面', cuisine: '拉面', price: '¥80', rating: 4.7, summary: '博多风味，独立隔间用餐体验。', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop' },
    ];

    const logs = [
        { title: '京都五日游', author: '小王', likes: 1234, summary: '第一次来京都，完全停不下来。', img: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=200&h=200&fit=crop' },
    ];


    const RenderCard = ({ item, icon: Icon }) => (
        <div className="glass" style={{
            padding: '12px',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'var(--transition)',
            display: 'flex',
            gap: '12px',
            marginBottom: '10px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'var(--glass-bg)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: 'white' }}>
                    <div style={{ background: 'rgba(124, 58, 237, 0.1)', padding: '4px', borderRadius: '6px' }}>
                        <Icon size={12} color="var(--accent-color)" />
                    </div>
                    {item.name || item.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.summary}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: 700 }}>{item.price || item.cuisine}</span>
                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                        <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px', color: 'rgba(255,255,255,0.6)' }}>
                            <Star size={10} fill="#f59e0b" color="#f59e0b" /> {item.rating || `${item.likes}`}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                            <Heart size={14} />
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} alt="" className="card-img" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', opacity: 0 }} />
            </div>
        </div>
    );

    return (
        <motion.aside className="side-panel" initial={false} animate={{ width: isOpen ? `${width}px` : '70px', padding: isOpen ? '24px' : '12px' }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} style={{ position: 'relative', overflow: 'hidden', borderRight: '1px solid var(--border-color)', background: 'rgba(5, 5, 6, 0.6)', backdropFilter: 'blur(40px)' }}>
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}
                    >
                        <div onMouseDown={handleResizeStart} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'ew-resize', zIndex: 100, transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-color)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="premium-gradient" style={{ width: '4px', height: '14px', borderRadius: '2px' }} />
                                <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>发现灵感</h3>
                            </div>
                            <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.4)', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}><RotateCcw size={14} /></button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingRight: '4px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>热门景点</div>
                                <div>{attractions.map((it, i) => <RenderCard key={i} item={it} icon={MapPin} />)}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>奢选酒店</div>
                                <div>{hotels.map((it, i) => <RenderCard key={i} item={it} icon={Hotel} />)}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>地道美食</div>
                                <div>{restaurants.map((it, i) => <RenderCard key={i} item={it} icon={UtensilsCrossed} />)}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>精选日志</div>
                                <div>{logs.map((it, i) => <RenderCard key={i} item={it} icon={BookOpen} />)}</div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', cursor: 'pointer', gap: '16px' }}
                        onClick={onToggle}
                    >
                        <div className="premium-gradient" style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px var(--accent-glow)' }}>
                            <TrendingUp size={20} color="white" />
                        </div>
                        <div style={{ writingMode: 'vertical-rl', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.2em' }}>发现灵感</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.aside>
    );
};

export default RecommendationsPanel;
