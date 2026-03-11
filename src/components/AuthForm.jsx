import { useState } from 'react'
import { supabase } from '../supabase'

const inp = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  border: '1.5px solid #e0d4c0', background: '#faf7f2',
  fontSize: 15, fontFamily: 'inherit', color: '#2a1f0e',
  outline: 'none', boxSizing: 'border-box',
}
const lbl = {
  fontSize: 12, fontWeight: 700, color: '#7a6a50',
  marginBottom: 6, display: 'block',
  textTransform: 'uppercase', letterSpacing: 0.9,
}

export default function AuthForm() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setError('')
    setMessage('')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      })
      if (error) setError(error.message)
      else setMessage('Account created! Check your email to confirm, then log in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#fdf8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>📖</div>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, color: '#2a1f0e', margin: '0 0 8px' }}>
            Family Memory Book
          </h1>
          <p style={{ color: '#9a8a70', fontSize: 15, margin: 0 }}>
            Your family's adventure journal
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: 24, padding: 32,
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
          border: '1.5px solid #ede4d4',
        }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 20, color: '#2a1f0e', margin: '0 0 24px' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your family account'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'signup' && (
              <div>
                <label style={lbl}>Family Name</label>
                <input
                  style={inp} placeholder="e.g. The Patels"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label style={lbl}>Email</label>
              <input
                type="email" style={inp} placeholder="you@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <div>
              <label style={lbl}>Password</label>
              <input
                type="password" style={inp} placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && (
              <div style={{ background: '#fde8e8', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#c04040', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div style={{ background: '#dcfce7', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#166534', fontWeight: 600 }}>
                ✅ {message}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? '#c0a080' : '#c0663a',
                color: 'white', border: 'none', borderRadius: 14,
                padding: '14px 0', fontSize: 16, fontWeight: 700,
                cursor: loading ? 'default' : 'pointer',
                fontFamily: "'Lora', serif", marginTop: 4,
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </div>

          {/* Toggle */}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#7a6a50' }}>
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); setMessage('') }}
                  style={{ background: 'none', border: 'none', color: '#c0663a', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  Sign up
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); setMessage('') }}
                  style={{ background: 'none', border: 'none', color: '#c0663a', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
