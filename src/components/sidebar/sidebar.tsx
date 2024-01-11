import Navigation from './navigation/navigation'

export default function Sidebar() {
  return (
    <div className="flex flex-col w-[280px] h-full min-h-screen p-3 bg-white">
      <Navigation />
    </div>
  )
}
