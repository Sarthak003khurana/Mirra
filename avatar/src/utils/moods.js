// ARKit-style blendshapes RPM avatars ship with, grouped into moods.
export const MOODS = {
  neutral: {},
  happy: {
    mouthSmileLeft: 0.6,
    mouthSmileRight: 0.6,
    cheekSquintLeft: 0.25,
    cheekSquintRight: 0.25,
  },
  serious: {
    browDownLeft: 0.5,
    browDownRight: 0.5,
    mouthFrownLeft: 0.2,
    mouthFrownRight: 0.2,
  },
  thinking: {
    browInnerUp: 0.4,
    eyeLookUpLeft: 0.3,
    eyeLookUpRight: 0.3,
  },
}

export const AVAILABLE_MOODS = Object.keys(MOODS)
