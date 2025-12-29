import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"

const BONE_GROUPS = {
    wingL: ["wing2L", "wing3L", "wing4L", "wing5L", "wing6L", "wing7L", "wing8L"],
    wingR: ["wing2R", "wing3R", "wing4R", "wing5R", "wing6R", "wing7R", "wing8R"],
    
    // To avoid the weird deformations, do not use spines 1-4
    spine: ["spine1", "spine2", "spine3", "spine4", "spine5", "spine6", "spine7", "spine8",
            "spine9", "spine10", "spine11", "spine12", "spine13", "spine14", "spine15", "spine16"],
}

export function useFlyAnimation(manta) {
    // Store the bones into the object structure above
    const groups = useMemo(() => {
        if (!manta?.nodes) return { wingL: [], wingR: [], spine: []}
        return Object.fromEntries(
            Object.entries(BONE_GROUPS).map(([key, names]) => [
                key,
                names.map(n => manta.nodes[n]).filter(Boolean)
            ])
        )
    }, [manta])

    const maxAngle = 0.3    // max wing rotation angle
    const speed = 2         // flap speed
    const bodyDelay = 0.2   // seconds body lags

    const spinePhaseOffsets = useMemo(() => {
        return BONE_GROUPS.spine.map((_, i) => {
            // Simple deterministic pseudo‑random based on index
            const seed = Math.sin(i * 12.9898) * 43758.5453
            return (seed - Math.floor(seed)) * Math.PI * 2
        })
    }, [])

    useFrame((state) => {
        // this tracks the time so t accounts for both lower to higher frame rates
        // the more time that passes, the larger the movement
        const t = state.clock.getElapsedTime()
        const flap = Math.sin(t * speed) // flap phase for wings
        const bodyFlap = Math.sin((t - bodyDelay) * speed) // delayed phase for body
        
        // Wings flap up and down around their rest pose
        groups.wingL.forEach((b, i) => {
            if (!b) return
            b.rotation.x = -flap * maxAngle
            if (i >= 3 && i <= 6) b.rotation.y = Math.sin(speed / 1.5 * t) * maxAngle
        })

        groups.wingR.forEach((b, i) => {
            if (!b) return
            b.rotation.x = -flap * maxAngle
            if (i >= 3 && i <= 6) b.rotation.y = -Math.sin(speed / 1.5 * t) * maxAngle
        })

        // Bobbing the whole manta via MASTER_CONTROL
        const masterControl = manta?.nodes?.MASTER_CONTROL
        if (masterControl) {
            // Cache starting Y so we don't drift
            if (masterControl.userData.baseY === undefined) {
                masterControl.userData.baseY = masterControl.position.y
            }
            const bobAmount = 0.2 // how much the body dips / rises on Y
            // When wings flap up (flap > 0), body dips down a little
            masterControl.position.y = masterControl.userData.baseY + bodyFlap * bobAmount
        }

        // Subtle wavy tail motion focused on the *actual* tail bones,
        // not the main body, so it doesn’t over-rotate.
        groups.spine.forEach((b, i) => {
            if (!b) return

            const TAIL_START = 4
            const TAIL_END = 15

            if (i < TAIL_START || i > TAIL_END) return

            // 0 at base of tail, 1 at tip
            const n = (i - TAIL_START) / (TAIL_END - TAIL_START)

            // Amplitude eases in toward the tip
            const baseAmplitude = 0.06        // almost no motion at tail base
            const tipAmplitude = 0.15         // gentle motion at tail tip
            const amplitude = baseAmplitude + (tipAmplitude - baseAmplitude) * (n * n)
            const waveSpeed = 1.2

            // Traveling wave down the tail + small per‑bone a bit random
            const phaseOffset = n * Math.PI * 0.8 + (spinePhaseOffsets[i] || 0)

            // Use x‑axis for up and down movement
            b.rotation.x = Math.sin(t * waveSpeed + phaseOffset) * amplitude
        })
    })
}