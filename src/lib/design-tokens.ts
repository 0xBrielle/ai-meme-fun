/**
 * Design Tokens
 * Single source of truth for all design values
 * Use these instead of hardcoding values in components
 */

// ============================================
// SPACING SCALE
// ============================================
export const SPACING = {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
} as const

// ============================================
// TYPOGRAPHY
// ============================================
export const FONT_SIZE = {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
} as const

export const FONT_WEIGHT = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
} as const

export const LINE_HEIGHT = {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
} as const

// ============================================
// COLORS (matching globals.css)
// ============================================
export const COLORS = {
    // Primary (Indigo)
    primary: {
        DEFAULT: '#6366F1',
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1',
        600: '#4F46E5',
        700: '#4338CA',
        800: '#3730A3',
        900: '#312E81',
    },
    // Secondary (Purple)
    secondary: {
        DEFAULT: '#8B5CF6',
        500: '#8B5CF6',
        600: '#7C3AED',
    },
    // Surfaces
    surface: {
        DEFAULT: '#1A1A1A',
        50: '#2A2A2A',
        100: '#1A1A1A',
        200: '#0F0F0F',
    },
    // Semantic
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    // Text
    text: {
        primary: '#FFFFFF',
        secondary: '#A1A1AA',
        muted: '#71717A',
    },
    // Background
    background: '#0F0F0F',
} as const

// ============================================
// COMPONENT SIZES
// ============================================
export const BUTTON_SIZES = {
    sm: {
        height: '32px',
        paddingX: '12px',
        fontSize: '14px',
    },
    md: {
        height: '40px',
        paddingX: '16px',
        fontSize: '14px',
    },
    lg: {
        height: '48px',
        paddingX: '24px',
        fontSize: '16px',
    },
} as const

export const INPUT_SIZES = {
    sm: {
        height: '32px',
        paddingX: '12px',
        fontSize: '14px',
    },
    md: {
        height: '40px',
        paddingX: '12px',
        fontSize: '14px',
    },
    lg: {
        height: '48px',
        paddingX: '16px',
        fontSize: '16px',
    },
} as const

// ============================================
// BORDER RADIUS
// ============================================
export const RADIUS = {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
} as const

// ============================================
// SHADOWS
// ============================================
export const SHADOWS = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const

// ============================================
// ANIMATION DURATIONS
// ============================================
export const ANIMATION = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
} as const

// ============================================
// Z-INDEX LAYERS
// ============================================
export const Z_INDEX = {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    toast: 500,
    tooltip: 600,
} as const

// ============================================
// BREAKPOINTS (matching Tailwind)
// ============================================
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const

// ============================================
// TOUCH TARGETS (accessibility)
// ============================================
export const TOUCH_TARGET = {
    minimum: '44px',  // WCAG minimum
    recommended: '48px',
} as const
