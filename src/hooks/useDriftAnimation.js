import { useFrame } from "@react-three/fiber"
import { useEffect, useState } from "react"

export function useDriftAnimation(manta) {
    useFrame((state, delta) => {
        const masterControl = manta?.nodes?.MASTER_CONTROL
        if (!masterControl) return

        if (masterControl.userData.baseZ === undefined) {
            masterControl.userData.baseZ = masterControl.position.z
            masterControl.position.z += 20
        }

        const moveForward = 5
        const zLimit = 0

        if (masterControl.position.z >= zLimit) {
            masterControl.position.z -= moveForward * delta
        }
    })
}