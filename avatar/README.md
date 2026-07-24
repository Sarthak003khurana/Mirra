# Mirra Avatar

Standalone 3D avatar system. React 19 + Vite + JSX (no TypeScript) +
React Three Fiber + drei. Loads a Ready Player Me avatar by URL, plays its
idle animation, and drives its viseme/expression morph targets in real time.

## Structure

- `src/components/AvatarScene.jsx` — Canvas, lighting, environment, wires the loaded mesh into LipSync/Expressions
- `src/components/AvatarModel.jsx` — GLB loading via `useGLTF`, finds the morph-target mesh, plays idle animation
- `src/components/LipSync.jsx` — plays a viseme schedule against `viseme_*` morph targets
- `src/components/Expressions.jsx` — drives mood morph targets (neutral/happy/serious/thinking)
- `src/components/CameraRig.jsx` — camera positioning
- `src/hooks/useMorphTargets.js` — smooth per-frame morph target interpolation, name-scoped so LipSync and Expressions don't fight over each other's blendshapes
- `src/hooks/useAnimationMixer.js` — plays/cross-fades a GLB animation clip via drei's `useAnimations`
- `src/hooks/useVisemeData.js` — joins the backend's `/ws/interview` socket and turns `viseme_data` events into a schedule
- `src/utils/visemeMapper.js` — maps Rhubarb's mouth shapes (A-X) to Ready Player Me's Oculus viseme blendshapes

## Run

```bash
npm install
npm run dev
```

The demo page (`src/App.jsx`) lets you paste in any model URL, play a demo
viseme schedule, and switch moods.

## About the model URL

Ready Player Me avatars are loaded from their CDN by URL
(`https://models.readyplayer.me/<avatar-id>.glb`) — they aren't bundled repo
assets. The demo defaults to a Khronos glTF sample instead, because
`models.readyplayer.me` didn't resolve from the sandbox this was built in
(DNS issue on that network, not a code problem). That sample proves the
loading → morph-target → animation pipeline works, but its morph targets
aren't named like RPM's `viseme_*`/ARKit set, so the lip-sync and mood
buttons are inert on it. Paste in a real RPM avatar URL to see them actually
move a face.

## Verified

- `visemeMapper.js`'s pure functions (Rhubarb shape → RPM viseme, schedule
  building) are unit-tested with plain Node — real assertions, not just "it compiles."
- Clean `npm run build` and `npm run lint`.
- No browser was available while building this, so the actual 3D
  rendering/lip-sync/expression behavior hasn't been visually confirmed —
  only the parts that don't require a GPU/DOM have been. Worth a manual
  pass with a real RPM avatar URL before calling this done.

## Not yet built

Full backend integration (the `/ws/interview` → `viseme_data` → this avatar's
mouth, tied to a real session) is explicitly the `integration` branch's job,
not this one. `useVisemeData.js` is the hook that integration will use.
