-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountStatus" VARCHAR(50) DEFAULT 'Pending',
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "guardianFirstName" DROP NOT NULL,
ALTER COLUMN "guardianLastName" DROP NOT NULL,
ALTER COLUMN "guardianPhoneNumber" DROP NOT NULL,
ALTER COLUMN "guardianAddress" DROP NOT NULL;
