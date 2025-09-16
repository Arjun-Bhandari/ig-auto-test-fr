'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader } from '../components/loader'
import { exchangeInstagramCode } from '../lib/instagram/api'

export function CallbackHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      
      if (!code) {
        console.error('No code received from Instagram')
        router.push('/')
        return
      }

      try {
        const data = await exchangeInstagramCode(code)
        console.log(data.data)
        window.localStorage.setItem('igUserId', data.data.igUserId);
        router.push('/')
      } catch (error) {
        console.error('Error exchanging code:', error)
        router.push('/?error=auth_failed')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="text-center">
      <Loader />
      <h1 className="mt-4 text-xl font-semibold">Hold on, We are Verifying Your Account...</h1>
    </div>
  )
}