type HeroIcon = React.ComponentType<
  React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?: string | undefined
    titleId?: string | undefined
  }
>

type PropsWithChildren = {
  children: React.ReactNode
}
