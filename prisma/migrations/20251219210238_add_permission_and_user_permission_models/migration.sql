-- CreateTable
CREATE TABLE "permissions" (
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "user_id" TEXT NOT NULL,
    "permission_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("user_id","permission_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_key_fkey" FOREIGN KEY ("permission_key") REFERENCES "permissions"("key") ON DELETE CASCADE ON UPDATE CASCADE;
