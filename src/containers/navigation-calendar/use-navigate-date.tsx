import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import {
  dateParamsSchema,
  dateToParams,
  parmasToDate,
} from './navigation-calendar.util'

const useNavigateDate = () => {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()

  const selectedDate = useMemo(() => parmasToDate(params), [params])

  const navigate = useCallback(
    (date: DateType) => {
      const dateParamsString = dateParamsSchema.parse(params).join('/')
      router.push(pathname.replace(dateParamsString, dateToParams(date)))
    },
    [params, pathname, router]
  )

  return { navigate, selectedDate }
}

export default useNavigateDate
