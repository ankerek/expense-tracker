import parse from 'date-fns/parse'
import format from 'date-fns/format'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import addMonths from 'date-fns/addMonths'

export const DATE_FORMAT = 'yyyy-MM-dd'

export const formatDate = (date: Date) => format(date, DATE_FORMAT)

export const parseDateString = (dateString: string) =>
  parse(dateString, DATE_FORMAT, new Date())

export const formatDateString = (dateString: string, formatString: string) =>
  format(parseDateString(dateString), 'PP')

export const getPeriod = ({
  currentPeriod,
  modifier,
}: {
  currentPeriod?: { __typename: string; start: string; end: string }
  modifier?: 'prev' | 'next'
} = {}) => {
  if (currentPeriod && !modifier) {
    return currentPeriod
  }

  let date = new Date()

  if (currentPeriod && modifier) {
    date = addMonths(
      parseDateString(currentPeriod.start),
      modifier === 'prev' ? -1 : 1
    )
  }

  return {
    __typename: 'TimePeriod',
    start: formatDate(startOfMonth(date)),
    end: formatDate(endOfMonth(date)),
  }
}
