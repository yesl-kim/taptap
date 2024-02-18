import { generateGuid } from '@/utils/parser'

type Props = {
  label: string
  trigger: React.ReactNode
}

const Tooltip = ({ label, trigger }: Props) => {
  const id = generateGuid()
  return (
    <div className="relative">
      <div className="peer" aria-describedby={id}>
        {trigger}
      </div>
      <p
        id={id}
        role="tooltip"
        className="absolute left-[50%] top-[100%] -translate-x-[50%] w-auto mt-1 z-10 bg-black/70 py-1 px-2 rounded-md text-white text-xs whitespace-nowrap invisible peer-hover:visible peer-focus-within:visible"
      >
        {label}
      </p>
    </div>
  )
}

export default Tooltip
