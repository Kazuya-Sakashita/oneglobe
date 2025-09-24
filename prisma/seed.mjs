// prisma/seed.mjs
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1) ユーザー（idempotent: userIdでupsert）
  const u1 = await prisma.profile.upsert({
    where: { userId: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      userId: '11111111-1111-1111-1111-111111111111',
      nickname: 'Alice',
      email: 'alice@example.com',
    },
  })
  const u2 = await prisma.profile.upsert({
    where: { userId: '22222222-2222-2222-2222-222222222222' },
    update: {},
    create: {
      userId: '22222222-2222-2222-2222-222222222222',
      nickname: 'Bob',
      email: 'bob@example.com',
    },
  })

  // 2) ルーム（idempotent: name+ownerId+isPrivateで疑似一意）
  const room =
    (await prisma.room.findFirst({
      where: { name: 'Alice & Bob', ownerId: u1.userId, isPrivate: false },
    })) ??
    (await prisma.room.create({
      data: { name: 'Alice & Bob', isPrivate: false, ownerId: u1.userId },
    }))

  // 3) メンバー（idempotent: 複合PK [roomId,userId] があるので skipDuplicates が効く）
  await prisma.roomMember.createMany({
    data: [
      { roomId: room.id, userId: u1.userId, role: 'OWNER' }, // ← OWNERに統一
      { roomId: room.id, userId: u2.userId, role: 'MEMBER' },
    ],
    skipDuplicates: true,
  })

  // 4) メッセージ（idempotent: 初回だけ投入）
  const count = await prisma.message.count({ where: { roomId: room.id } })
  if (count === 0) {
    await prisma.message.createMany({
      data: [
        { roomId: room.id, userId: u1.userId, body: 'Hello Bob!' },
        { roomId: room.id, userId: u2.userId, body: 'やあ Alice!' },
      ],
    })
  }

  // 5) APIテスト用のexport行を出力（コピペで使える）
  console.log('Seed completed.')
  console.log(`export ROOM_ID="${room.id}"`)
  console.log(`export USER_ID="${u1.userId}"  # Alice`)
  console.log(`export USER2_ID="${u2.userId}" # Bob`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
