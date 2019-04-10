import React from 'react'
import { GetCurrentUser } from '@modules/user/GetCurrentUser'
import { Amount } from './elements'

interface FormattedAmountProps {
  amount: number
}

export class FormattedAmount extends React.PureComponent<FormattedAmountProps> {
  render() {
    const { amount } = this.props
    return (
      <>
        <Amount>{amount}</Amount>
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
