import Profile from '../profile/profile'
import Navigation from './navigation/navigation'

export default function Sidebar() {
  return (
    <div className="flex h-full min-h-screen flex-col items-center gap-8 bg-white p-3">
      <Profile />
      <Navigation />
    </div>
  )
}
