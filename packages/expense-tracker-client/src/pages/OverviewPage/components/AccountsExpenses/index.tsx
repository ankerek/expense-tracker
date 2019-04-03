import React from 'react'
import values from 'lodash/values'
import { Account, Transaction } from '@schema-types'
import { sum } from '@utils/math'
import { List } from '@core-components/List'
import { Box } from '@core-components/Box'
import { FormattedAmount } from '@core-components/FormattedAmount'
import { Typography } from '@material-ui/core'

interface AccountsExpensesProps {
  transactions: Transaction[]
}

interface AccountWithAmount extends Account {
  amount: number
}

export class AccountsExpenses extends React.Component<AccountsExpensesProps> {
  render() {
    const { transactions } = this.props

    const accountsById = transactions.reduce(
      (acc, curr) => {
        if (acc[curr.account.id]) {
          acc[curr.account.id].amount = sum(
            acc[curr.account.id].amount,
            curr.amount
          )
        } else {
          acc[curr.account.id] = { ...curr.account, amount: curr.amount }
        }

        return acc
      },
      {} as {
        [accountId: string]: AccountWithAmount
      }
    )

    const accounts = values(accountsById)

    return (
      <>
        <Box marginLeft="20px">
          <Typography variant="h5">Expenses by accounts</Typography>
        </Box>
        <List>
          {accounts.map(account => (
            <List.Item key={account.id}>
              <List.ItemRow>
                {account.name}
                <Box marginLeft="auto">
                  <FormattedAmount>{account.amount}</FormattedAmount>
                </Box>
              </List.ItemRow>
            </List.Item>
          ))}
        </List>
      </>
    )
  }
}
