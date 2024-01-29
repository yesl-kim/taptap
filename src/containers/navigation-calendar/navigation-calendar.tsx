'use client'

import useNavigateDate from './use-navigate-date'

import CalendarNavigator from './navigator'
import Calendar from '@/components/calendar/calendar'

const NavigationCalendar = () => {
  const { navigate, selectedDate } = useNavigateDate()

  return <Calendar selectedDate={selectedDate} onChange={navigate} />
}

NavigationCalendar.Navigator = CalendarNavigator

export default NavigationCalendar
