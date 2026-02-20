'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProcessingOverlayProps {
    isVisible: boolean
    progress: number // 0–100, or -1 for indeterminate
    status: string
    inputImage?: string | null
    prompt?: string
}

export function ProcessingOverlay({
    isVisible,
    progress,
    status,
    inputImage,
    prompt,
}: ProcessingOverlayProps) {
    const [dots, setDots] = React.useState(0)

    // Animate the ellipsis: "Creating…" → "Creating……" cycling every 500ms
    React.useEffect(() => {
        if (!isVisible) return
        const timer = setInterval(() => setDots((d) => (d + 1) % 4), 500)
        return () => clearInterval(timer)
    }, [isVisible])

    const ellipsis = '.'.repeat(dots)

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="processing-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8"
                    style={{
                        background: 'rgba(245, 239, 233, 0.92)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    }}
                >
                    <div className="flex flex-col items-center gap-8 w-full max-w-[320px]">

                        {/* ── Logo animation ring ─────────────────────────────── */}
                        <div className="relative flex items-center justify-center">

                            {/* Outer rotating gradient ring */}
                            <motion.div
                                className="absolute rounded-full"
                                style={{
                                    width: 120,
                                    height: 120,
                                    background: 'conic-gradient(from 0deg, #D4788A, #C9955C, #F5B8C4, #D4788A)',
                                    filter: 'blur(0px)',
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Inner mask (creates the ring effect) */}
                            <div
                                className="absolute rounded-full"
                                style={{
                                    width: 108,
                                    height: 108,
                                    background: 'rgba(245, 239, 233, 0.96)',
                                }}
                            />

                            {/* Logo — pulse in and out gently */}
                            <motion.div
                                className="relative z-10 rounded-full overflow-hidden flex items-center justify-center"
                                style={{
                                    width: 88,
                                    height: 88,
                                    background: 'white',
                                    boxShadow: '0 4px 24px rgba(212,120,138,0.18)',
                                    padding: 10,
                                }}
                                animate={{
                                    scale: [1, 1.04, 1],
                                    boxShadow: [
                                        '0 4px 24px rgba(212,120,138,0.18)',
                                        '0 8px 36px rgba(212,120,138,0.32)',
                                        '0 4px 24px rgba(212,120,138,0.18)',
                                    ],
                                }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <img
                                    src="/assets/logos/logoElle.png"
                                    alt="Elle AI"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </motion.div>

                            {/* 3 orbiting dots */}
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: i === 0 ? '#D4788A' : i === 1 ? '#C9955C' : '#F5B8C4',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: -4,
                                        marginLeft: -4,
                                        transformOrigin: '4px 4px',
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 2.4,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        delay: i * 0.8,
                                    }}
                                    // Position each dot at 60px radius
                                    initial={false}
                                >
                                    {/* Translate out from center */}
                                    <motion.div
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            background: i === 0 ? '#D4788A' : i === 1 ? '#C9955C' : '#F5B8C4',
                                            transform: 'translateX(56px)',
                                            width: 8,
                                            height: 8,
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* ── Text section ────────────────────────────────────── */}
                        <div className="text-center space-y-2 w-full">
                            <motion.p
                                className="text-[18px] font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #D4788A, #C9955C)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    letterSpacing: '-0.01em',
                                }}
                                animate={{ opacity: [0.85, 1, 0.85] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                {status}{ellipsis}
                            </motion.p>

                            {prompt && (
                                <p
                                    className="text-[13px] font-light italic line-clamp-2 px-2"
                                    style={{ color: '#9B8D87' }}
                                >
                                    "{prompt}"
                                </p>
                            )}
                        </div>

                        {/* ── If user attached an image, show it as a reference preview ── */}
                        {inputImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full"
                            >
                                <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-center mb-2" style={{ color: '#BFB0AB' }}>
                                    Reference Image
                                </p>
                                <div
                                    className="rounded-2xl overflow-hidden mx-auto"
                                    style={{
                                        width: 96,
                                        height: 96,
                                        border: '1.5px solid rgba(212,120,138,0.2)',
                                        boxShadow: '0 4px 16px rgba(212,120,138,0.1)',
                                    }}
                                >
                                    <img
                                        src={inputImage}
                                        alt="Reference"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* ── Progress bar ─────────────────────────────────────── */}
                        <div className="w-full space-y-2">
                            <div
                                className="h-1.5 w-full rounded-full overflow-hidden"
                                style={{ background: 'rgba(212,120,138,0.12)' }}
                            >
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        background: 'linear-gradient(90deg, #D4788A 0%, #C9955C 100%)',
                                    }}
                                    initial={{ width: '0%' }}
                                    animate={
                                        progress >= 0
                                            ? { width: `${progress}%` }
                                            : {
                                                // Indeterminate: shimmer sweep left to right
                                                x: ['-100%', '400%'],
                                                width: '40%',
                                            }
                                    }
                                    transition={
                                        progress >= 0
                                            ? { duration: 0.5, ease: 'easeOut' }
                                            : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                                    }
                                />
                            </div>

                            {progress >= 0 && (
                                <p className="text-center text-[11px] font-semibold" style={{ color: '#D4788A' }}>
                                    {progress}%
                                </p>
                            )}
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
