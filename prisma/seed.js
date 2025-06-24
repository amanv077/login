const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Starting database seeding...')

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('❌ Admin user already exists!')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123456', 12)
    
    const admin = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@company.com',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
        isActive: true,
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@company.com')
    console.log('🔑 Password: Admin@123456')
    console.log('⚠️  Please change the password after first login!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
