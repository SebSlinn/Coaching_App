import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function SupabaseTest() {
  const [status, setStatus] = useState('Testing connection...')
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(import.meta.env.VITE_SUPABASE_URL || 'NOT FOUND')
    
    supabase.from('users').select('count').then(({ data, error }) => {
      if (error) {
        setStatus('❌ Failed: ' + error.message)
      } else {
        setStatus('✅ Connected to Supabase successfully')
      }
    })
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h2>Supabase Connection Test</h2>
      <p><strong>URL:</strong> {url}</p>
      <p><strong>Status:</strong> {status}</p>
    </div>
  )
}