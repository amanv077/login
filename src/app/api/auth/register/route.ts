import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendOTPEmail } from '@/lib/email'
import { createEmailVerification } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = 'USER' } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      }
    })

    // Generate and send OTP
    const { otp } = await createEmailVerification(email, user.id)
    const emailResult = await sendOTPEmail(email, otp)

    if (!emailResult.success) {
      // Delete the created user if email sending fails
      await prisma.user.delete({ where: { id: user.id } })
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User registered successfully. Please check your email for verification code.',
      userId: user.id
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    // Check if this is a table not found error
    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json(
        { 
          error: 'Database not initialized',
          message: 'The database tables need to be created. Please run the database setup first.',
          setupUrl: '/api/setup-db'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    )
  }
}
