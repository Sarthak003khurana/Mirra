// Standard Oculus/ARKit viseme blendshapes that Ready Player Me avatars ship
// with (viseme_PP, viseme_aa, ...). CLAUDE.md's chosen lip-sync tool, Rhubarb,
// emits its own mouth shapes (A-X) instead - this maps between the two.
const VISEME_WEIGHT = 0.9

const RHUBARB_TO_VISEME = {
  A: 'viseme_PP',
  B: 'viseme_kk',
  C: 'viseme_E',
  D: 'viseme_aa',
  E: 'viseme_O',
  F: 'viseme_U',
  G: 'viseme_FF',
  H: 'viseme_TH',
  X: 'viseme_sil',
}

export function rhubarbShapeToViseme(shape) {
  return RHUBARB_TO_VISEME[shape] ?? 'viseme_sil'
}

export function visemeWeights(visemeName) {
  if (!visemeName || visemeName === 'viseme_sil') return {}
  return { [visemeName]: VISEME_WEIGHT }
}

/** Converts Rhubarb's `mouthCues` output ([{ start, end, value }]) into a
 * schedule LipSync can play back, with `value` translated to an RPM viseme name. */
export function buildVisemeSchedule(mouthCues = []) {
  return mouthCues.map((cue) => ({
    start: cue.start,
    end: cue.end,
    value: rhubarbShapeToViseme(cue.value),
  }))
}
