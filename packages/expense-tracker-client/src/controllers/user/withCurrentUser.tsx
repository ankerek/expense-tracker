import React from 'react'
import { User } from '@schema-types'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type Subtract<T, K> = Omit<T, keyof K>

export interface WithCurrentUserInjectedProps {
  currentUser?: User
}

export const withCurrentUser = <P extends WithCurrentUserInjectedProps>(
  Component: React.ComponentType<P>
) =>
  class WithCurrentUser extends React.Component<
    Subtract<P, WithCurrentUserInjectedProps>
  > {
    render() {
      return (
        <GetCurrentUser>
          {({ data }) => (
            <Component
              {...this.props}
              currentUser={data ? data.getCurrentUser : undefined}
            />
          )}
        </GetCurrentUser>
      )
    }
  }
