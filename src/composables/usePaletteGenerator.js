import { ref, computed, watch } from 'vue'
import { useColorUtils } from './useColorUtils'
import { useLocalStorage } from './useLocalStorage'

export function usePaletteGenerator() {
    const {
        hexToRgb,
        rgbToHex,
        generateRandomColor,
        getContrastColor,
        adjustHsl
    } = useColorUtils()

    const palette = ref([])
    const pinnedColors = ref([])
    const colorCount = ref(5)
    const colorFormat = ref('hex')
    const baseColor = useLocalStorage('baseColor', '#3b82f6')
    const paletteType = useLocalStorage('paletteType', 'analogous')
    const mood = useLocalStorage('mood', 'balanced')

    const generatePalette = () => {
        let colors = []

        switch(paletteType.value) {
            case 'monochromatic':
                colors = generateMonochromatic(baseColor.value, colorCount.value)
                break
            case 'analogous':
                colors = generateAnalogous(baseColor.value, colorCount.value)
                break
            case 'triadic':
                colors = generateTriadic(baseColor.value)
                break
            case 'complementary':
                colors = generateComplementary(baseColor.value)
                break
            case 'splitComplementary':
                colors = generateSplitComplementary(baseColor.value)
                break
            case 'square':
                colors = generateSquare(baseColor.value)
                break
            case 'compound':
                colors = generateCompound(baseColor.value)
                break
            default:
                colors = generateAnalogous(baseColor.value, colorCount.value)
        }

        // Apply mood adjustments
        colors = applyMood(colors, mood.value)

        // Keep pinned colors in their positions if possible
        palette.value = colors.map((color, index) => {
            if (pinnedColors.value[index]) {
                return pinnedColors.value[index].color
            }
            return color
        })
    }

    const generateMonochromatic = (baseHex, count) => {
        const colors = [baseHex]
        const hsl = hexToHsl(baseHex)

        for (let i = 1; i < count; i++) {
            const lightness = Math.max(10, Math.min(90, hsl.l + (i * 15) - 30))
            const saturation = Math.max(20, Math.min(100, hsl.s + (i * 10) - 20))

            colors.push(hslToHex({
                h: hsl.h,
                s: saturation,
                l: lightness
            }))
        }

        return colors
    }

    const generateAnalogous = (baseHex, count) => {
        const colors = [baseHex]
        const hsl = hexToHsl(baseHex)

        for (let i = 1; i < count; i++) {
            const offset = i % 2 === 0 ? 30 * (i/2) : -30 * ((i+1)/2)
            const newHsl = {
                h: (hsl.h + offset + 360) % 360,
                s: Math.max(40, Math.min(100, hsl.s + (i % 2 === 0 ? 10 : -10))),
                l: Math.max(20, Math.min(80, hsl.l + (i % 2 === 0 ? 5 : -5)))
            }
            colors.push(hslToHex(newHsl))
        }

        return colors
    }

    const generateTriadic = (baseHex) => {
        const hsl = hexToHsl(baseHex)
        return [
            baseHex,
            hslToHex({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }),
            hslToHex({ h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l }),
            hslToHex({ h: (hsl.h + 60) % 360, s: hsl.s, l: hsl.l }),
            hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l })
        ]
    }

    const generateComplementary = (baseHex) => {
        const hsl = hexToHsl(baseHex)
        const complementaryHue = (hsl.h + 180) % 360

        return [
            baseHex,
            hslToHex({ h: complementaryHue, s: hsl.s, l: hsl.l }),
            hslToHex({ h: hsl.h, s: hsl.s * 0.8, l: hsl.l * 1.2 }),
            hslToHex({ h: complementaryHue, s: hsl.s * 0.8, l: hsl.l * 1.2 }),
            hslToHex({ h: hsl.h, s: hsl.s * 0.6, l: hsl.l * 1.4 })
        ]
    }

    const generateSplitComplementary = (baseHex) => {
        const hsl = hexToHsl(baseHex)
        const complementaryHue = (hsl.h + 180) % 360

        return [
            baseHex,
            hslToHex({ h: (complementaryHue + 30) % 360, s: hsl.s, l: hsl.l }),
            hslToHex({ h: (complementaryHue - 30 + 360) % 360, s: hsl.s, l: hsl.l }),
            hslToHex({ h: hsl.h, s: hsl.s * 0.7, l: hsl.l * 1.3 }),
            hslToHex({ h: complementaryHue, s: hsl.s * 0.9, l: hsl.l * 0.9 })
        ]
    }

    const generateSquare = (baseHex) => {
        const hsl = hexToHsl(baseHex)
        return [
            baseHex,
            hslToHex({ h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l }),
            hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }),
            hslToHex({ h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l }),
            hslToHex({ h: (hsl.h + 45) % 360, s: hsl.s * 0.8, l: hsl.l * 1.1 })
        ]
    }

    const generateCompound = (baseHex) => {
        const hsl = hexToHsl(baseHex)
        return [
            baseHex,
            hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }),
            hslToHex({ h: (hsl.h + 30) % 360, s: hsl.s * 0.9, l: hsl.l * 1.1 }),
            hslToHex({ h: (hsl.h + 210) % 360, s: hsl.s * 0.9, l: hsl.l * 0.9 }),
            hslToHex({ h: (hsl.h + 60) % 360, s: hsl.s * 0.8, l: hsl.l * 1.2 })
        ]
    }

    const applyMood = (colors, moodType) => {
        return colors.map(color => {
            const hsl = hexToHsl(color)

            switch(moodType) {
                case 'calm':
                    // Мягкие, приглушенные тона
                    return hslToHex({
                        h: hsl.h,
                        s: Math.max(30, hsl.s * 0.7),
                        l: Math.min(70, hsl.l * 1.1)
                    })

                case 'energetic':
                    // Яркие, насыщенные цвета
                    return hslToHex({
                        h: hsl.h,
                        s: Math.min(100, hsl.s * 1.3),
                        l: hsl.l * 0.9
                    })

                case 'professional':
                    // Сдержанные, нейтральные тона
                    return hslToHex({
                        h: hsl.h,
                        s: Math.max(20, hsl.s * 0.5),
                        l: hsl.l > 50 ? 40 : 60
                    })

                case 'warm':
                    // Теплые тона с акцентом на красные/желтые
                    const warmHue = hsl.h < 60 || hsl.h > 300 ? hsl.h : 30
                    return hslToHex({
                        h: warmHue,
                        s: Math.min(80, hsl.s * 1.1),
                        l: hsl.l
                    })

                case 'cool':
                    // Холодные тона с акцентом на синие/зеленые
                    const coolHue = hsl.h >= 60 && hsl.h <= 240 ? hsl.h : 200
                    return hslToHex({
                        h: coolHue,
                        s: Math.min(70, hsl.s * 0.9),
                        l: Math.min(80, hsl.l * 1.05)
                    })

                default:
                    return color
            }
        })
    }

    // HSL conversion helpers
    const hexToHsl = (hex) => {
        const rgb = hexToRgb(hex)
        if (!rgb) return { h: 0, s: 0, l: 0 }

        const r = rgb.r / 255
        const g = rgb.g / 255
        const b = rgb.b / 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h, s, l = (max + min) / 2

        if (max === min) {
            h = s = 0
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break
                case g: h = (b - r) / d + 2; break
                case b: h = (r - g) / d + 4; break
            }
            h /= 6
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        }
    }

    const hslToHex = (hsl) => {
        const h = hsl.h / 360
        const s = hsl.s / 100
        const l = hsl.l / 100

        let r, g, b

        if (s === 0) {
            r = g = b = l
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1
                if (t > 1) t -= 1
                if (t < 1/6) return p + (q - p) * 6 * t
                if (t < 1/2) return q
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
                return p
            }

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q

            r = hue2rgb(p, q, h + 1/3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1/3)
        }

        return rgbToHex(
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        )
    }

    const togglePinColor = (color, index) => {
        const existingIndex = pinnedColors.value.findIndex(p => p.index === index)

        if (existingIndex > -1) {
            pinnedColors.value.splice(existingIndex, 1)
        } else {
            pinnedColors.value.push({ color, index })
        }
    }

    const isColorPinned = (index) => {
        return pinnedColors.value.some(p => p.index === index)
    }

    const clearPinnedColors = () => {
        pinnedColors.value = []
        generatePalette()
    }

    const setRandomBaseColor = () => {
        baseColor.value = generateRandomColor()
        generatePalette()
    }

    // Watch for changes
    watch([baseColor, paletteType, colorCount, mood], () => {
        generatePalette()
    }, { immediate: true })

    return {
        palette,
        pinnedColors,
        colorCount,
        colorFormat,
        baseColor,
        paletteType,
        mood,
        generatePalette,
        togglePinColor,
        isColorPinned,
        clearPinnedColors,
        setRandomBaseColor
    }
}