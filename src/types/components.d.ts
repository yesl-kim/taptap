type HeroIcon = React.ComponentType<
  React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?: string | undefined
    titleId?: string | undefined
  }
>

type PropsWithChildren = {
  children: React.ReactNode
}

type DefaultParmasType = {
  [key: string]: string | string[] | undefined
}

type PageProps<P, S> = {
  params: P & DefaultParmasType
  searchParams: S & DefaultParmasType
}

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}
