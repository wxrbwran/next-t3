import { getServerSession } from "next-auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { authOptions } from "@/server/auth";

export async function POST(
  req: Request,
  //   { params }: { params: { title: string } },
) {
  const session = await getServerSession(authOptions);
  console.log("posts session", session);
  if (!session?.user) {
    return new NextResponse("请先登录", { status: 401 });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await req.json();
  const id = session.user.id;
  console.log("req", json);
  try {
    const post = await db.post.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        name: json.title,
        createdById: id,
      },
    });
    return NextResponse.json(post);
  } catch (e) {
    console.log("[POSTS_POST]", e);
    return new NextResponse("服务器错误", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  //   { params }: { params: { serverId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("请先登录", { status: 401 });
    }
    const json: { id: string } = (await req.json()) as { id: string };

    const post = await db.post.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: Number.parseInt(json.id),
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.log("[POSTS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
