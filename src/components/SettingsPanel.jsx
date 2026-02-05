import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Map, Shield, Bell, Zap, Database } from 'lucide-react';

const SettingsPanel = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 1100 }} />
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="glass-card" style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100%', borderRadius: 0, borderLeft: '1px solid var(--glass-border)', padding: '32px', zIndex: 1200 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>系统偏好设置</h2>
                            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', padding: '8px', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {/* 地图适配器选择 - 关键能力 */}
                            <section>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-secondary)' }}><Map size={18} /><span>地图引擎适配器</span></div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {['Mapbox (推荐)', 'Google Maps', 'Gaode (高德)', 'Apple Maps'].map((source) => (
                                        <div key={source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                                            <span style={{ fontSize: '13px' }}>{source}</span>
                                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {source.includes('Mapbox') && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-color)' }} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* AI 偏好 */}
                            <section>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-secondary)' }}><Zap size={18} /><span>AI 规划节奏</span></div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                    {['佛系', '适中', '特种兵'].map(m => (
                                        <button key={m} style={{ padding: '10px', borderRadius: '10px', border: m === '适中' ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)', background: 'transparent', color: 'white', fontSize: '12px', cursor: 'pointer' }}>{m}</button>
                                    ))}
                                </div>
                            </section>

                            {/* 离线与隐私 */}
                            <section>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-secondary)' }}><Shield size={18} /><span>数据与隐私</span></div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px' }}>离线地图包下载</span>
                                        <button style={{ fontSize: '11px', color: 'var(--accent-color)', background: 'transparent', border: 'none', cursor: 'pointer' }}>管理 (2.4GB)</button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px' }}>自动同步照片流</span>
                                        <div style={{ width: '36px', height: '20px', borderRadius: '20px', background: 'var(--accent-color)', position: 'relative' }}><div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%' }} /></div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            Designed by Global Design Studio · v1.5.0
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsPanel;
