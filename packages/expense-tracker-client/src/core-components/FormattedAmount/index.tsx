import React from 'react'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'

interface FormattedAmountProps {
  currency?: string
  children: number
}

export class FormattedAmount extends React.PureComponent<FormattedAmountProps> {
  render() {
    const { currency, children } = this.props
    return (
      <>
        {children}
        <GetCurrentUser fetchPolicy="cache-first">
          {({ data: { getCurrentUser } }) =>
            getCurrentUser ? <>&nbsp;{getCurrentUser.currency.symbol}</> : null
          }
        </GetCurrentUser>
      </>
    )
  }
}
