import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


import MapContainer from './MapContainer';
import TravelRecordsPanel from './TravelRecordsPanel';
import { Map, FileText, Notebook, Calendar, Zap, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';

const Visualizer = ({ mode = 'map', center = { lat: 34.992, lng: 135.772 } }) => {

    const [currentView, setCurrentView] = useState(mode);
    const [isPanelVisible, setIsPanelVisible] = useState(true);

    // 妯℃嫙浠婃棩璇︾粏琛岀▼鏁版嵁
    const todaySteps = [
        { time: '10:30', title: '鍑哄彂锛氫含閮界珯', detail: '浠庝腑澶彛涔樺反澹?, done: true },
        { time: '11:15', title: '鏅偣锛氭竻姘村', detail: '寤鸿娓哥帺 2 灏忔椂', current: true },
        { time: '13:30', title: '缇庨锛氫笁骞村潅鍗堥', detail: '鎺ㄨ崘灏濊瘯姹よ眴鑵?, done: false },
        { time: '15:00', title: '鏅偣锛氬叓鍧傜绀?, detail: '澶曢槼鎷嶆憚缁濅匠浣?, done: false }
    ];

    return (
        <div className="center-stage" style={{ position: 'relative', height: '100%' }}>
            {/* 椤跺眰閫忔槑 Overlay 灞傜骇 */}

            {/* 4. 寮哄埗寮瑰嚭鐨勯潰鏉?(Managed by App and PlanningModal now) */}
            <AnimatePresence>
            </AnimatePresence>

            {/* 1. 妯″紡鍒囨崲鍣?- 绮捐嚧鎮诞鑳跺泭 */}
            <div style={{
                position: 'absolute',
                top: '76px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '4px',
                zIndex: 2000,
                padding: '4px',
                background: 'rgba(5, 5, 8, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
                {[
                    { id: 'map', icon: <Map size={15} />, label: '鍏ㄦ櫙鍦板浘' },
                    { id: 'studio', icon: <Sparkles size={15} />, label: '鍒涗綔妯″紡' },
                    { id: 'records', icon: <Notebook size={15} />, label: '瓒宠抗璁板綍' }
                ].map(view => (
                    <button
                        key={view.id}
                        onClick={() => setCurrentView(view.id)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: currentView === view.id ? 'var(--accent-color)' : 'transparent',
                            color: currentView === view.id ? 'white' : 'rgba(255,255,255,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: currentView === view.id ? '0 4px 15px var(--accent-glow)' : 'none'
                        }}
                    >
                        {view.icon} {view.label}
                    </button>
                ))}
            </div>
            {/* 1. 妯″紡鍒囨崲鍣?- 绮捐嚧鎮诞鑳跺泭 */}
            <div style={{
                position: 'absolute',
                top: '76px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '4px',
                zIndex: 2000,
                padding: '4px',
                background: 'rgba(5, 5, 8, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
                {[
                    { id: 'map', icon: <Map size={15} />, label: '鍏ㄦ櫙鍦板浘' },
                    { id: 'studio', icon: <Sparkles size={15} />, label: '鍒涗綔妯″紡' },
                    { id: 'records', icon: <Notebook size={15} />, label: '瓒宠抗璁板綍' }
                ].map(view => (
                    <button
                        key={view.id}
                        onClick={() => setCurrentView(view.id)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: currentView === view.id ? 'var(--accent-color)' : 'transparent',
                            color: currentView === view.id ? 'white' : 'rgba(255,255,255,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: currentView === view.id ? '0 4px 15px var(--accent-glow)' : 'none'
                        }}
                    >
                        {view.icon} {view.label}
                    </button>
                ))}
            </div>

            {/* 2. 绾靛悜鎮诞闈㈡澘 - 浠呭湪鍦板浘妯″紡鏄剧ず */}
            <AnimatePresence>
                {currentView === 'map' && (
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: isPanelVisible ? 0 : -320, opacity: 1 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                        style={{
                            position: 'absolute',
                            top: '72px',
                            left: '24px',
                            width: '320px',
                            zIndex: 1000,
                            pointerEvents: 'none'
                        }}
                    >
                        {/* 闈㈡澘鍐呭涓讳綋 */}
                        <div className="glass-card" style={{
                            padding: '24px',
                            background: 'rgba(5, 5, 6, 0.9)',
                            border: '1px solid var(--accent-color)',
                            borderRadius: '24px',
                            pointerEvents: 'auto',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                            position: 'relative'
                        }}>
                            {/* Accent Line */}
                            <div className="premium-gradient" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '3px', borderRadius: '0 0 4px 4px' }} />

                            {/* 鏍囬 & 鎶樺彔鎸夐挳 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: 'rgba(124, 58, 237, 0.15)', padding: '6px', borderRadius: '8px' }}>
                                        <Calendar size={16} color="var(--accent-color)" />
                                    </div>
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>浠婃棩瀹炴椂琛岀▼</span>
                                </div>
                                <button
                                    onClick={() => setIsPanelVisible(false)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.4)', padding: '6px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                            </div>

                            {/* 姝ラ鏉″唴瀹?*/}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '7px', top: '76px', bottom: '12px', width: '2px', background: 'rgba(255,255,255,0.05)' }} />
                                {todaySteps.map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '18px', position: 'relative' }}>
                                        <div style={{
                                            width: '16px', height: '16px', borderRadius: '50%',
                                            background: step.current ? 'var(--accent-color)' : 'rgba(23, 23, 26, 1)',
                                            border: step.current ? '4px solid rgba(124, 58, 237, 0.3)' : '2px solid rgba(255,255,255,0.1)',
                                            zIndex: 2, flexShrink: 0, marginTop: '2px',
                                            boxShadow: step.current ? '0 0 15px var(--accent-glow)' : 'none'
                                        }} />
                                        <div style={{ flex: 1, opacity: step.done ? 0.4 : 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 700, color: step.current ? 'var(--accent-color)' : 'white' }}>{step.title}</span>
                                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{step.time}</span>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{step.detail}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 搴曢儴蹇嵎鎿嶄綔 */}
                            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
                                <button style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '12px', fontWeight: 700, padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}><Zap size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />鏇磋交鏉?/button>
                                <button style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'white', fontSize: '12px', fontWeight: 600, padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}>閬块洦鏂规</button>
                            </div>
                        </div>

                        {/* 灞曞紑娴爣 (褰撻潰鏉块殣钘忔椂鏄剧ず) */}
                        <AnimatePresence>
                            {!isPanelVisible && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => setIsPanelVisible(true)}
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '320px',
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '16px',
                                        background: 'var(--accent-color)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 25px var(--accent-glow)',
                                        pointerEvents: 'auto'
                                    }}
                                >
                                    <ChevronRight size={24} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {currentView === 'map' ? (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <MapContainer center={center} />

                    </motion.div>
                ) : (
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.05), transparent), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.03), transparent)', paddingTop: '0', overflowY: 'auto' }}
                    >
                        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 40px 60px' }}>
                            {currentView === 'records' ? <TravelRecordsPanel /> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                    {/* Studio Header */}
                                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                            <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '12px', background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>鐏垫劅鍒涗綔鐢诲竷</h2>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>姹囪仛鍏ㄧ悆鏃呰缇庡锛屾縺鍙戜笅涓€娆¤惤绗旂殑鍕囨皵</p>
                                        </motion.div>
                                    </div>

                                    {/* Canvas Grid - Enhanced UI */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                                        {[
                                            { title: '浜兘路妯辫姳钀藉箷', color: '#fda4af', tag: '瀛ｈ妭闄愬畾', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800' },
                                            { title: '灞嬩箣鏋佺畝路鍜岄', color: '#94a3b8', tag: '绌洪棿缇庡', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800' },
                                            { title: '娣卞椋熷爞路鍛宠暰', color: '#fbbf24', tag: '鍩庡競鎺㈠簵', img: 'https://images.unsplash.com/photo-1580828343064-f641a1c6543b?q=80&w=800' },
                                            { title: '鏋佽嚧鏁堢巼路琛岃€?, color: '#818cf8', tag: 'AI 鏂规', img: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=800' },
                                            { title: '灞遍噹鍛煎惛路娌绘剤', color: '#4ade80', tag: '娣卞害鎴峰', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800' },
                                            { title: '鍖犲績浼犳壙路闈為仐', color: '#c084fc', tag: '鏂囧寲瀵艰', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=800' }
                                        ].map((card, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.08 * idx, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                                whileHover={{ y: -12, scale: 1.02 }}
                                                className="glass-card"
                                                style={{
                                                    height: '420px',
                                                    borderRadius: '32px',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                                                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
                                                }}
                                            >
                                                <motion.img
                                                    src={card.img}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 1.2 }}
                                                />
                                                {/* Overlays */}
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,6,0.95) 0%, rgba(5,5,6,0.4) 40%, transparent 100%)' }} />
                                                <div style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.6 }}>
                                                    <Heart size={20} color="white" />
                                                </div>

                                                <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px' }}>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.2 + (0.1 * idx) }}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            background: 'rgba(255,255,255,0.08)',
                                                            padding: '6px 14px',
                                                            borderRadius: '12px',
                                                            marginBottom: '16px',
                                                            border: `1px solid ${card.color}33`,
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                    >
                                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: card.color, boxShadow: `0 0 10px ${card.color}` }} />
                                                        <span style={{ fontSize: '11px', color: card.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{card.tag}</span>
                                                    </motion.div>
                                                    <h4 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: '8px' }}>{card.title}</h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                                                        <span>鐢?AI 鍗忎綔鐢熸垚</span>
                                                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                                                        <span>鎺㈢储鐏垫劅 鈫?/span>
                                                    </div>
                                                </div>

                                                {/* Hover Glow Effect */}
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    border: '2px solid transparent',
                                                    borderRadius: '32px',
                                                    background: `linear-gradient(135deg, ${card.color}11, transparent) border-box`,
                                                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                                                    WebkitMaskComposite: 'destination-out',
                                                    pointerEvents: 'none',
                                                    opacity: 0,
                                                    transition: '0.4s'
                                                }} className="card-border-glow" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Visualizer;

