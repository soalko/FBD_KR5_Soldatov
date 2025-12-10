import { computed } from 'vue'

export function useColorUtils() {
    const hexToRgb = (hex) => {
        hex = hex.replace(/^#/, '')
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('')
        }

        const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }

    const rgbToHex = (r, g, b) => {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('')
    }

    const getContrastColor = (hex) => {
        const rgb = hexToRgb(hex)
        if (!rgb) return '#000000'

        // Calculate relative luminance
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })

        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
        return luminance > 0.179 ? '#000000' : '#ffffff'
    }

    const generateRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    }

    const formatColor = (hex, format) => {
        if (format === 'hex') return hex.toUpperCase()

        const rgb = hexToRgb(hex)
        if (!rgb) return hex

        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    }

    const adjustHsl = (color, adjustments) => {
        // Helper function to adjust HSL values
        return color // Simplified for now
    }

    const getColorName = (hex) => {
        const rgb = hexToRgb(hex)
        if (!rgb) return 'Unknown'

        const { r, g, b } = rgb

        // Simple color naming based on RGB values
        if (r > 200 && g < 100 && b < 100) return 'Red'
        if (r > 200 && g > 150 && b < 100) return 'Orange'
        if (r > 200 && g > 200 && b < 100) return 'Yellow'
        if (r < 100 && g > 150 && b < 100) return 'Green'
        if (r < 100 && g > 150 && b > 150) return 'Cyan'
        if (r < 100 && g < 100 && b > 200) return 'Blue'
        if (r > 150 && g < 100 && b > 150) return 'Purple'
        if (r > 150 && g < 100 && b > 150) return 'Violet'
        if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) {
            if (r > 200) return 'White'
            if (r < 50) return 'Black'
            return 'Gray'
        }

        return 'Color'
    }

    const isValidHex = (hex) => {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
    }

    return {
        hexToRgb,
        rgbToHex,
        getContrastColor,
        generateRandomColor,
        formatColor,
        adjustHsl,
        getColorName,
        isValidHex
    }
}