-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "emailAddress" VARCHAR(180) NOT NULL,
    "password" TEXT NOT NULL,
    "role" VARCHAR(10) NOT NULL DEFAULT 'Student',
    "bio" VARCHAR(200),
    "gender" VARCHAR(20) NOT NULL,
    "age" INTEGER NOT NULL,
    "profileImage" TEXT,
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "streetAddress" VARCHAR(180),
    "phoneNumber" VARCHAR(50),
    "guardianFirstName" VARCHAR(50) NOT NULL,
    "guardianLastName" VARCHAR(50) NOT NULL,
    "guardianPhoneNumber" VARCHAR(50) NOT NULL,
    "guardianAddress" VARCHAR(50) NOT NULL,
    "isAccountSuspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_emailAddress_key" ON "users"("emailAddress");
