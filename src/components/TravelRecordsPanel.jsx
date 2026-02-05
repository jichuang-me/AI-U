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
            background: 'var(--surface-color)',
            borderRadius: '16px',
            padding: '24px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--accent-color)" />
                <h2 style={{ fontSize: '16px', fontWeight: 600 }}>旅行记录</h2>
            </div>

            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                {records.map((record) => (
                    <motion.div
                        key={record.id}
                        whileHover={{ y: -4 }}
                        onClick={() => setSelectedRecord(record)}
                        className="glass"
                        style={{
                            minWidth: '200px',
                            padding: '16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            border: selectedRecord?.id === record.id ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            background: record.status === '已完成' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            color: record.status === '已完成' ? '#22c55e' : 'var(--accent-color)',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 500,
                            marginBottom: '12px'
                        }}>
                            {record.status}
                        </div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>{record.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            <Calendar size={12} />
                            {record.date}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', fontSize: '20px' }}>
                            {record.images.map((img, idx) => (
                                <span key={idx}>{img}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {selectedRecord && (
                    <motion.div
                        key={selectedRecord.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass"
                        style={{
                            padding: '20px',
                            borderRadius: '12px',
                            flex: 1,
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{selectedRecord.title}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {selectedRecord.summary}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="glass"
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        border: 'none',
                                        color: 'white'
                                    }}
                                >
                                    <Download size={14} />
                                    导出
                                </button>
                                <button
                                    className="glass"
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        border: 'none',
                                        color: 'white'
                                    }}
                                >
                                    <Share2 size={14} />
                                    分享
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div className="glass" style={{ padding: '16px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>预算</div>
                                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent-color)' }}>
                                    ¥ {selectedRecord.budget.toLocaleString()}
                                </div>
                            </div>
                            <div className="glass" style={{ padding: '16px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    {selectedRecord.status === '已完成' ? '实际花费' : '预计花费'}
                                </div>
                                <div style={{ fontSize: '20px', fontWeight: 600, color: selectedRecord.actual > 0 ? '#22c55e' : 'var(--text-secondary)' }}>
                                    {selectedRecord.actual > 0 ? `¥ ${selectedRecord.actual.toLocaleString()}` : '待统计'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>
                                <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                行程亮点
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {selectedRecord.highlights.map((highlight, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            color: 'var(--accent-color)'
                                        }}
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
