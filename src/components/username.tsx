import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function UserName() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <p>Please log in to access the dashboard.</p>;
  }
  return (
    <>
    {session.user?.name || "User"}
    </>
  )
}

