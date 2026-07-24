import { Component, Suspense } from 'react'
import AvatarModel from './AvatarModel'

// Ready Player Me avatars are served from models.readyplayer.me/<id>.glb, not
// bundled into the repo. Override with your own RPM avatar id via
// VITE_RPM_AVATAR_URL. If that CDN is unreachable (it was from the sandbox
// this project was originally built in) or the URL fails to load, this falls
// back to the bundled `public/avatar/interviewer.glb` - three.js's own
// facecap.glb sample, which ships real ARKit blendshapes so lip-sync still
// works, just on a face-only bust instead of a full RPM body.
const RPM_AVATAR_URL = import.meta.env.VITE_RPM_AVATAR_URL || ''
const FALLBACK_AVATAR_URL = '/avatar/interviewer.glb'

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('[AvatarModel] Ready Player Me GLB failed to load, falling back to bundled avatar:', error)
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Tries the configured Ready Player Me avatar first, and falls back to the
 * bundled GLB if that fails - so this works out of the box even when RPM's
 * CDN isn't reachable, but upgrades automatically once it is. */
export default function AvatarWithFallback({ onReady, idleClipName }) {
  if (!RPM_AVATAR_URL) {
    return <AvatarModel url={FALLBACK_AVATAR_URL} onReady={onReady} idleClipName={idleClipName} />
  }

  return (
    <ModelErrorBoundary fallback={<AvatarModel url={FALLBACK_AVATAR_URL} onReady={onReady} idleClipName={idleClipName} />}>
      <Suspense fallback={null}>
        <AvatarModel url={RPM_AVATAR_URL} onReady={onReady} idleClipName={idleClipName} />
      </Suspense>
    </ModelErrorBoundary>
  )
}
