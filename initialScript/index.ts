import 'dotenv/config'; // Load environment variables
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ROLENAME } from 'src/shared/constants/role.constant';
import envConfig from 'src/shared/config';
import { HashingService } from 'src/shared/services/hashing.service';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const hashingSerice = new HashingService();
const prisma = new PrismaClient({
  adapter,
  log: ['info', 'warn', 'error'],
});

const main = async () => {
  const roleCount = await prisma.role.count();
  if (roleCount > 0) {
    throw new Error('Roles already exist in the database. Initialization aborted.');
  }
  const roles = await prisma.role.createMany({
    data: [
      {
        name: ROLENAME.Admin,
        description: 'Administrator with full access',
      },
      {
        name: ROLENAME.User,
        description: 'Regular user with limited access',
      },
    ],
  });
  const adminRole = await prisma.role.findFirstOrThrow({
    where: { name: ROLENAME.Admin },
  });
  const hashedPassword = await hashingSerice.hash(envConfig.ADMIN_PASSWORD);
  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONENUMBER,
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });
  return {
    createdRoleCount: roles.count,
    adminUser,
  };
};
main();
