import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface Props {
  children: React.ReactNode
}

export default function StyledSelectButton({ children }: Props) {
  return (
    <div className="flex gap-2 items-center p-2 outline-none focus:outline-none">
      {children}
      <ChevronDownIcon aria-hidden className="w-3" strokeWidth={3} />
    </div>
  )
}
