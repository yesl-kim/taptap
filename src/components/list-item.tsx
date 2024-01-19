type ListItemProps = PropsWithChildren & {
  before?: React.ReactNode
}

const ListItem = ({ children, before }: ListItemProps) => {
  return (
    <li className="min-h-[32px] flex items-center gap-4 mb-3 last-of-type:mb-0">
      {before ? (
        <div className="self-stretch w-[40px] flex items-center justify-center max-h-[36px]">
          <div
            className="w-[20px] h-[20px] flex items-center justify-center"
            aria-hidden
          >
            {before}
          </div>
        </div>
      ) : null}
      <div>{children}</div>
    </li>
  )
}

export default ListItem
