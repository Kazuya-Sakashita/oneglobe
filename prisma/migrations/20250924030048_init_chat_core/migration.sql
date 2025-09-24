-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."attachments" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."messages" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."room_invites" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."rooms" ALTER COLUMN "id" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "messages_user_id_created_at_idx" ON "public"."messages"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "reactions_message_id_idx" ON "public"."reactions"("message_id");

-- CreateIndex
CREATE INDEX "room_members_user_id_idx" ON "public"."room_members"("user_id");

-- CreateIndex
CREATE INDEX "room_members_room_id_idx" ON "public"."room_members"("room_id");

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
