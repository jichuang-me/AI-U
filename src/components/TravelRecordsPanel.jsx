import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Share2, Calendar, MapPin, DollarSign } from 'lucide-react';

const TravelRecordsPanel = () => {
    const [selectedRecord, setSelectedRecord] = useState(null);

    // 模拟旅行记录数据
    const records = [
        {
            id: 1,
            title: '京都五日游',
            status: '已完成',
            date: '2025-12-15',
            budget: 8500,
            actual: 7800,
            summary: '这次京都之旅非常完美，体验了传统文化和现代美食的完美结合。',
            highlights: ['清水寺', '伏见稻荷', '岚山竹林'],
            images: ['🏯', '⛩️', '🎋']
        },
        {
            id: 2,
            title: '东京购物行',
            status: '规划中',
            date: '2026-03-20',
            budget: 12000,
            actual: 0,
            summary: 'AI 推荐的购物路线，涵盖银座、表参道和秋叶原等热门商圈。',
            highlights: ['银座', '表参道', '秋叶原'],
            images: ['🛍️', '🏬', '🎮']
        },
        {
            id: 3,
            title: '北海道温泉之旅',
            status: '规划中',
            date: '2026-02-10',
            budget: 15000,
            actual: 0,
            summary: '冬季北海道温泉体验，包含滑雪和美食探索。',
            highlights: ['登别温泉', '札幌雪祭', '小樽运河'],
            images: ['♨️', '⛷️', '🦀']
        }
    ];

    return (
        <div style={{
            background: 'transparent',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="premium-gradient" style={{ width: '6px', height: '20px', borderRadius: '3px' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>旅行记忆库</h2>
            </div>

            {/* Premium Passport Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.01 }}
                className="glass-card"
                style={{
                    padding: '30px',
                    borderRadius: '32px',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)' }} />

                <div style={{ display: 'flex', gap: '40px', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>探索者等级</div>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>GLO-TROTTER IV</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>已打卡国家/地区</div>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>12 / 195</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>本年足迹里程</div>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>14,582 KM</div>
                    </div>
                </div>

                <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 0 auto', boxShadow: '0 0 20px var(--accent-glow)' }}>
                        <Share2 size={24} color="white" />
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>数字护照已同步</div>
                </div>
            </motion.div>

            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
                {records.map((record) => (
                    <motion.div
                        key={record.id}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onClick={() => setSelectedRecord(record)}
                        className="glass"
                        style={{
                            minWidth: '240px',
                            padding: '24px',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            border: selectedRecord?.id === record.id ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                            background: selectedRecord?.id === record.id ? 'rgba(124, 58, 237, 0.05)' : 'rgba(255,255,255,0.02)',
                            transition: 'var(--transition)',
                            boxShadow: selectedRecord?.id === record.id ? '0 10px 30px var(--accent-glow)' : 'var(--shadow-lg)'
                        }}
                    >
                        <div style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            background: record.status === '已完成' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(124, 58, 237, 0.15)',
                            color: record.status === '已完成' ? '#10b981' : 'var(--accent-color)',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '16px'
                        }}>
                            {record.status}
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '10px', color: 'white' }}>{record.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '16px' }}>
                            <Calendar size={14} color="var(--accent-color)" />
                            {record.date}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '24px' }}>
                            {record.images.map((img, idx) => (
                                <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '12px' }}>{img}</div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {selectedRecord && (
                    <motion.div
                        key={selectedRecord.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        style={{
                            padding: '32px',
                            borderRadius: '32px',
                            flex: 1,
                            overflowY: 'auto',
                            background: 'rgba(5, 5, 6, 0.4)',
                            border: '1px solid var(--border-color)',
                            backdropFilter: 'blur(40px)',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.4)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
                            <div style={{ flex: 1, paddingRight: '40px' }}>
                                <h3 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px', color: 'white', letterSpacing: '-0.02em' }}>{selectedRecord.title}</h3>
                                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '800px' }}>
                                    {selectedRecord.summary}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        border: '1px solid var(--border-color)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        transition: '0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                    <Download size={16} />
                                    PDF 导出
                                </button>
                                <button
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        border: 'none',
                                        background: 'var(--accent-color)',
                                        color: 'white',
                                        transition: '0.2s',
                                        boxShadow: '0 4px 15px var(--accent-glow)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                                >
                                    <Share2 size={16} />
                                    分享广场
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                                <div style={{ fontSize: '12px', color: 'var(--accent-color)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>预期预算</div>
                                <div style={{ fontSize: '32px', fontWeight: 900, color: 'white' }}>
                                    ¥{selectedRecord.budget.toLocaleString()}
                                </div>
                            </div>
                            <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {selectedRecord.status === '已完成' ? '实际花费' : '预计花费'}
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: 900, color: 'white' }}>
                                    {selectedRecord.actual > 0 ? `¥${selectedRecord.actual.toLocaleString()}` : '计算中...'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ background: 'rgba(124, 58, 237, 0.1)', padding: '6px', borderRadius: '8px' }}>
                                    <MapPin size={16} color="var(--accent-color)" />
                                </div>
                                行程亮点记录
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {selectedRecord.highlights.map((highlight, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: 'rgba(255,255,255,0.8)',
                                            transition: '0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'white'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                                    >
                                        {highlight}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TravelRecordsPanel;
