import React from 'react'
import { GetCurrentUser } from '@modules/user/GetCurrentUser'

interface FormattedAmountProps {
  children: React.ReactNode
}

export class FormattedAmount extends React.PureComponent<FormattedAmountProps> {
  render() {
    const { children } = this.props
    return (
      <>
        {children}
        <GetCurrentUser>
          {({ data }) =>
            data && data.getCurrentUser ? (
              <>&nbsp;{data.getCurrentUser.currency.symbol}</>
            ) : null
          }
        </GetCurrentUser>
      </>
    )
  }
}
