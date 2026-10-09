"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบก่อนดำเนินการ");
  }
  return session.user;
}

export async function verifyUserAction() {
  await requireUser();
  revalidatePath("/");
  return { success: true };
}