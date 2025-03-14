import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";


export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Please log in to access the dashboard.</p>;
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name || "User"}!</h1>
      <p>Your email: {session.user?.email}</p>
    </div>
  );
}
