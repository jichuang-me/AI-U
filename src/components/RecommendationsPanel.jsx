import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Hotel, BookOpen, UtensilsCrossed, Star, TrendingUp, Users, Plus, Heart, RotateCcw } from 'lucide-react';

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

    const sectionHeight = 'calc((100vh - 96px - 120px) / 4)';

    const RenderCard = ({ item, icon: Icon }) => (
        <div className="glass" style={{ padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon size={12} color="var(--accent-color)" /> {item.name || item.title}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.summary}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px' }}>
                        <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{item.price || item.cuisine}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={8} fill="gold" color="gold" /> {item.rating || `❤️ ${item.likes}`}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <Plus size={12} style={{ opacity: 0.5 }} />
                        <Heart size={12} style={{ opacity: 0.5 }} />
                    </div>
                </div>
            </div>
            <img src={item.img} style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} alt="" />
        </div>
    );

    return (
        <motion.aside className="side-panel" initial={false} animate={{ width: isOpen ? `${width}px` : '60px', padding: isOpen ? '24px' : '12px' }} style={{ position: 'relative', overflow: 'hidden' }}>
            {isOpen ? (
                <>
                    <div onMouseDown={handleResizeStart} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '8px', cursor: 'ew-resize', zIndex: 100 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                        <div style={{ height: sectionHeight, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><h3 style={{ fontSize: '13px', fontWeight: 600 }}>景点推荐</h3><RotateCcw size={14} style={{ opacity: 0.5 }} /></div>
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>{attractions.map((it, i) => <RenderCard key={i} item={it} icon={MapPin} />)}</div>
                        </div>
                        <div style={{ height: sectionHeight, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '8px' }}><h3 style={{ fontSize: '13px', fontWeight: 600 }}>酒店推荐</h3></div>
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>{hotels.map((it, i) => <RenderCard key={i} item={it} icon={Hotel} />)}</div>
                        </div>
                        <div style={{ height: sectionHeight, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '8px' }}><h3 style={{ fontSize: '13px', fontWeight: 600 }}>餐饮推荐</h3></div>
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>{restaurants.map((it, i) => <RenderCard key={i} item={it} icon={UtensilsCrossed} />)}</div>
                        </div>
                        <div style={{ height: sectionHeight, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '8px' }}><h3 style={{ fontSize: '13px', fontWeight: 600 }}>旅行日志</h3></div>
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>{logs.map((it, i) => <RenderCard key={i} item={it} icon={BookOpen} />)}</div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', cursor: 'pointer' }} onClick={onToggle}>
                    <TrendingUp size={20} color="var(--accent-color)" /><div style={{ writingMode: 'vertical-rl', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>推荐经验</div>
                </div>
            )}
        </motion.aside>
    );
};

export default RecommendationsPanel;
