import React from 'react'

interface FormattedAmountProps {
  currency?: string
  children: number
}

export class FormattedAmount extends React.PureComponent<FormattedAmountProps> {
  render() {
    const { currency, children } = this.props
    return (
      <>
        {children}&nbsp;{currency}
      </>
    )
  }
}
