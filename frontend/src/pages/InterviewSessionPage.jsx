import { useParams } from 'react-router-dom'
import Session from '../components/interview/Session'
import Navbar from '../components/layout/Navbar'

export default function InterviewSessionPage() {
  const { sessionId } = useParams()

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main className="px-6 py-10">
        <Session sessionId={sessionId} />
      </main>
    </div>
  )
}
