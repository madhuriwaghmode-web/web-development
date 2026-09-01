import { Link } from 'react-router-dom'
import { Eye, ScanEye, ShieldCheck, Users, FileText, Wifi, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: ScanEye, title: 'AI-assisted screening', desc: 'Upload a retina image and get a screening-support result in minutes.' },
  { icon: ShieldCheck, title: 'Explainable by design', desc: 'Every AI-shaped result is clearly labeled — real or placeholder, never guessed.' },
  { icon: Users, title: 'Built for care teams', desc: 'Health workers capture, doctors review, admins manage access — one workflow.' },
  { icon: FileText, title: 'Screening reports', desc: 'A printable AI Screening Report for every completed screening.' },
  { icon: Wifi, title: 'Rural-ready', desc: 'Works on unreliable connections — queue locally, sync when back online.' },
  { icon: Eye, title: 'History & follow-up', desc: 'Track risk over time and keep follow-ups from falling through the cracks.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-500 text-white">
            <Eye size={18} />
          </span>
          <span className="text-lg font-semibold text-slate-900">DrishtiAI</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Log in</Link>
          <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700">
            Create Account
          </Link>
        </nav>
      </header>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-14">
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
          AI-Powered<br />Diabetic Retinopathy Screening
        </h1>
        <p className="mt-5 text-lg text-slate-500 max-w-xl mx-auto">
          Early screening. Explainable AI. Better support for rural healthcare.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/register" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700">
            Start Screening <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50">
            Learn More
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border border-slate-200 p-5">
            <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-50 text-brand-600 mb-3">
              <Icon size={20} />
            </span>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{desc}</p>
          </div>
        ))}
      </section>

      <section id="how-it-works" className="bg-slate-50 py-14 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">How it works</h2>
          <ol className="grid sm:grid-cols-5 gap-4 text-sm text-slate-600">
            {['Upload retinal image', 'AI analyzes image', 'Prediction generated', 'AI explanation displayed', 'Screening report created'].map((step, i) => (
              <li key={step} className="flex flex-col items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-semibold grid place-items-center">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">Built for places specialists can't always reach</h2>
        <p className="text-slate-500">
          A trained health worker can capture and run a screening in minutes, without waiting for a specialist visit.
          Doctors review flagged cases remotely, so limited specialist time goes where it's needed most.
        </p>
      </section>

      <footer className="border-t border-slate-200 py-8 px-6">
        <p className="max-w-3xl mx-auto text-center text-xs text-slate-400">
          This application is a screening-support tool and does not replace examination or diagnosis by a
          qualified healthcare professional.
        </p>
      </footer>
    </div>
  )
}
