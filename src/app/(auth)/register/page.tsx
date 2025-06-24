'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface PasswordStrength {
  score: number
  feedback: string
  color: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const router = useRouter()

  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    let feedback = ''
    
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score < 3) {
      feedback = 'Weak'
      return { score, feedback, color: 'bg-red-500' }
    } else if (score < 5) {
      feedback = 'Medium'
      return { score, feedback, color: 'bg-yellow-500' }
    } else {
      feedback = 'Strong'
      return { score, feedback, color: 'bg-green-500' }
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        // Redirect to verification page after 2 seconds
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
        }, 2000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'USER':
        return { icon: '👤', name: 'User', description: 'Standard access with basic features' }
      case 'AGENT':
        return { icon: '🏢', name: 'Agent', description: 'Extended permissions for business operations' }
      case 'ADMIN':
        return { icon: '⚙️', name: 'Administrator', description: 'Full system access and management' }
      default:
        return { icon: '👤', name: 'User', description: 'Standard access with basic features' }
    }
  }

  const currentRoleInfo = getRoleInfo(formData.role)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and get started today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400 bg-gray-50 focus:bg-white"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400 bg-gray-50 focus:bg-white"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Account Type */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-gray-50 focus:bg-white text-black"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="USER">👤 User</option>
                <option value="AGENT">🏢 Agent</option>
                <option value="ADMIN">⚙️ Administrator</option>
              </select>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{currentRoleInfo.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{currentRoleInfo.name}</p>
                    <p className="text-xs text-gray-600">{currentRoleInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400 bg-gray-50 focus:bg-white pr-12"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.feedback === 'Weak' ? 'text-red-600' :
                      passwordStrength.feedback === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors placeholder-gray-400 bg-gray-50 focus:bg-white pr-12 ${
                    formData.confirmPassword === '' ? 'border-gray-300' :
                    passwordsMatch ? 'border-green-300 focus:border-green-500' : 'border-red-300 focus:border-red-500'
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  {formData.confirmPassword && (
                    <div className="mr-1">
                      {passwordsMatch ? (
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              {formData.confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="ml-2 text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
            
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex">
                  <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="ml-2 text-sm text-green-600">{message}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !passwordsMatch || formData.password.length < 8}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            
            <Link
              href="/login"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
            >
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
