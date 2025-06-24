import { prisma } from './prisma'

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const createEmailVerification = async (email: string, userId?: string) => {
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  const verification = await prisma.emailVerification.create({
    data: {
      email,
      otp,
      expiresAt,
      userId,
    },
  })

  return { otp, verificationId: verification.id }
}

export const verifyOTP = async (email: string, otp: string) => {
  const verification = await prisma.emailVerification.findFirst({
    where: {
      email,
      otp,
      status: 'PENDING',
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  if (!verification) {
    return { success: false, message: 'Invalid or expired OTP' }
  }

  await prisma.emailVerification.update({
    where: { id: verification.id },
    data: { status: 'VERIFIED' },
  })

  return { success: true, verification }
}

export const cleanupExpiredOTPs = async () => {
  await prisma.emailVerification.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}
