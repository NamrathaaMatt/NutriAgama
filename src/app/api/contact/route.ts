import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.json();

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const question = String(body.question ?? "").trim();

  if (!name || !email || !subject || !question) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject,
    order_id: body.orderId || null,
    product: body.product || null,
    question,
    message: body.message || null,
  });

  if (error) {
    console.error("Contact insert failed:", error.message);
    return NextResponse.json(
      { error: "Could not save your message." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}