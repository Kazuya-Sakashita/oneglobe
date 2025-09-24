// src/app/api/rooms/[roomId]/messages/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { roomId: string }
type Ctx = { params: Params } | { params: Promise<Params> }
const getParams = async (ctx: Ctx) => (await Promise.resolve(ctx.params)) as Params

// UUIDの形のみ検証（Postgres受理に委ねる）
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// 共通レスポンス（エラー形を統一）
const j = (data: unknown, status = 200) =>
  NextResponse.json(data, { status })
const bad = (message: string, status = 400) =>
  j({ error: { message } }, status)

export async function GET(request: Request, ctx: Ctx) {
  const { roomId } = await getParams(ctx)
  if (!UUID_RE.test(roomId)) return bad('invalid roomId')

  const { searchParams } = new URL(request.url)
  // NaN/負数/上限超のガード
  const limitRaw = Number.parseInt(searchParams.get('limit') ?? '50', 10)
  const offsetRaw = Number.parseInt(searchParams.get('offset') ?? '0', 10)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 50
  const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0

  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: 'asc' },
    skip: offset,
    take: limit,
    include: {
      author: {
        select: { userId: true, nickname: true, avatarUrl: true }, // 最低限のみ
      },
    },
  })
  return j(messages)
}

export async function POST(request: Request, ctx: Ctx) {
  const { roomId } = await getParams(ctx)
  if (!UUID_RE.test(roomId)) return bad('invalid roomId')

  const payload = await request.json().catch(() => null)
  const body = typeof payload?.body === 'string' ? payload.body.trim() : ''
  const userId = typeof payload?.userId === 'string' ? payload.userId.trim() : ''
  if (!body) return bad('body is required')
  if (!UUID_RE.test(userId)) return bad('valid userId is required')

  // ルーム存在チェック
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { id: true } })
  if (!room) return bad('room not found', 404)

  // ユーザー存在チェック（Profile.userId）
  const user = await prisma.profile.findUnique({ where: { userId }, select: { userId: true } })
  if (!user) return bad('user not found', 404)

  // 所属チェック（未所属は403）
  const member = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
    select: { roomId: true },
  })
  if (!member) return bad('not a member of this room', 403)

  const msg = await prisma.message.create({
    data: { roomId, userId, body },
    include: {
      author: { select: { userId: true, nickname: true, avatarUrl: true } },
    },
  })
  return j(msg, 201)
}
