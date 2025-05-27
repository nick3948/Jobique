import { currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const user = await currentUser()
  return <div className="p-4 text-xl">Welcome, {user?.firstName} 👋</div>
}