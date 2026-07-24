import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export default function CameraRig({ position = [0, 1.5, 2.2], target = [0, 1.5, 0] }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(...position)
    camera.lookAt(...target)
  }, [camera, position, target])

  return null
}
