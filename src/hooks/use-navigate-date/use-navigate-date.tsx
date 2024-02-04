import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { isSameDay } from 'date-fns'

import {
  dateParamsSchema,
  dateToParams,
  parmasToDate,
} from './use-navigate-date.utils'
import useToday from '../useToday'

const useNavigateDate = () => {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const { today } = useToday()

  const selectedDate = useMemo(
    () => parmasToDate(params) ?? today,
    [params, today],
  )

  const navigate = useCallback(
    (date: DateType) => {
      if (isSameDay(selectedDate, date)) return

      const next = dateToParams(date)
      const dateParams = dateParamsSchema.safeParse(params)

      if (!dateParams.success) {
        router.push(`${pathname}/${next}`)
      } else {
        const cur = dateParams.data.join('/')
        router.push(pathname.replace(cur, next))
      }
    },
    [params, pathname, router, selectedDate],
  )

  return { navigate, selectedDate }
}

export default useNavigateDate
