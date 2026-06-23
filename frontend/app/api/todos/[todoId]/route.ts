import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ todoId: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { todoId } = await params;
  const body = await request.json();
  const res = await fetch(`${process.env.BACKEND_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { todoId } = await params;
  await fetch(`${process.env.BACKEND_URL}/todos/${todoId}`, { method: "DELETE" });
  return new NextResponse(null, { status: 204 });
}
