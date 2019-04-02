import React from 'react'
import { GetCurrentUser } from '@modules/user/GetCurrentUser'

interface FormattedAmountProps {
  currency?: string
  children: React.ReactNode
}

export class FormattedAmount extends React.PureComponent<FormattedAmountProps> {
  render() {
    const { currency, children } = this.props
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
