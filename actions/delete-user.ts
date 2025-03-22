// app/actions/delete-user.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
