import gql from 'graphql-tag'
import { getPeriod } from '@utils/date'

export const typeDefs = gql`
  extend type Query {
    isOnline: Boolean!
    overviewFilter: OverviewFilter
  }

  type OverviewFilter {
    period: TimePeriod
    accounts: [String]
  }

  type TimePeriod {
    start: String
    end: String
  }
`

export const initialState = {
  isOnline: true,
  overviewFilter: {
    __typename: 'OverviewFilter',
    period: getPeriod(),
    accounts: ['123'],
  },
}
