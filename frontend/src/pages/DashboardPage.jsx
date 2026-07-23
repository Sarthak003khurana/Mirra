import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Preview from '../components/resume/Preview'
import Suggestions from '../components/resume/Suggestions'
import UploadForm from '../components/resume/UploadForm'
import { interviewApi } from '../services/interviewApi'
import { useResumeStore } from '../stores/resumeStore'

export default function DashboardPage() {
  const resumes = useResumeStore((state) => state.resumes)
  const fetchResumes = useResumeStore((state) => state.fetchResumes)

  const [sessions, setSessions] = useState([])
  const [sessionsError, setSessionsError] = useState(null)
  const [isStartingInterview, setIsStartingInterview] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchResumes()

    interviewApi
      .listSessions()
      .then(setSessions)
      .catch(() => setSessionsError('Session history is not available yet.'))
  }, [fetchResumes])

  async function handleStartInterview(resumeId) {
    setIsStartingInterview(true)
    try {
      const session = await interviewApi.createSession(resumeId)
      navigate(`/interview/${session.id}`)
    } catch {
      // Interview session orchestration isn't live on the backend yet.
      navigate(`/interview/local-${resumeId}`)
    } finally {
      setIsStartingInterview(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        <section>
          <h2 className="text-lg font-semibold text-white">Upload a resume</h2>
          <div className="mt-4">
            <UploadForm />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Your resumes</h2>
          {resumes.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No resumes uploaded yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {resumes.map((resume) => (
                <div key={resume.id}>
                  <Preview resume={resume} />
                  <Suggestions resume={resume} />
                  <button
                    type="button"
                    onClick={() => handleStartInterview(resume.id)}
                    disabled={isStartingInterview}
                    className="mt-3 w-full rounded-lg bg-teal-500 py-2 text-sm font-semibold text-ink transition-colors hover:bg-teal-400 disabled:opacity-60"
                  >
                    Start interview with this resume
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Session history</h2>
          {sessionsError && <p className="mt-4 text-sm text-zinc-500">{sessionsError}</p>}
          {!sessionsError && sessions.length === 0 && (
            <p className="mt-4 text-sm text-zinc-500">No interview sessions yet.</p>
          )}
          {!sessionsError && sessions.length > 0 && (
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
              {sessions.map((session) => (
                <li key={session.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-zinc-300">Session #{session.id}</span>
                  <span className="text-zinc-500">{session.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
