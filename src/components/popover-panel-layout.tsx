import { XMarkIcon } from '@heroicons/react/24/outline'

import IconButton, { IconButtonProps } from './icon-button'

type Props = PropsWithChildren & {
  header?: IconButtonProps[]
  footer?: React.ReactNode
  close: () => void
}

const PopoverPanelLayout = ({
  header = [],
  footer,
  children,
  close,
}: Props) => (
  <div className="rounded border-[1px] border-gray-200 bg-white px-1.5 pt-2 shadow-black drop-shadow-xl">
    <header className="flex justify-end gap-2">
      {header.map((props) => (
        <IconButton key={props.label} {...props} />
      ))}
      <IconButton Icon={XMarkIcon} label="닫기" onClick={close} />
    </header>
    <main className="pb-4">{children}</main>
    {footer ? (
      <footer className="border-t-[1px] border-gray-200 px-2">{footer}</footer>
    ) : null}
  </div>
)

export default PopoverPanelLayout
