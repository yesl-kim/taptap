import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import {
  dateParamsSchema,
  dateToParams,
  parmasToDate,
} from './use-navigate-date.utils'

const useNavigateDate = () => {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()

  const selectedDate = useMemo(() => parmasToDate(params), [params])

  const navigate = useCallback(
    (date: DateType) => {
      const currentParams = dateParamsSchema.parse(params).join('/')
      const nextParams = dateToParams(date)
      if (currentParams === nextParams) return
      router.push(pathname.replace(currentParams, nextParams))
    },
    [params, pathname, router],
  )

  return { navigate, selectedDate }
}

export default useNavigateDate
