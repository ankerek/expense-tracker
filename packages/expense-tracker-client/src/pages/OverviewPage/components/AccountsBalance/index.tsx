import React from 'react'
import values from 'lodash/values'
import { Account, Transaction } from '@schema-types'
import { sum } from '@utils/math'
import { sortByAmount } from '@utils/sortByAmount'
import { List } from '@components/List'
import { Box } from '@components/Box'
import { FormattedAmount } from '@components/FormattedAmount'
import { Typography } from '@material-ui/core'

interface AccountsBalanceProps {
  transactions: Transaction[]
}

interface AccountWithAmount extends Account {
  amount: number
}

export class AccountsBalance extends React.Component<AccountsBalanceProps> {
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

    const accounts = values(accountsById).sort(sortByAmount('desc'))

    return (
      <>
        <Box marginLeft="20px">
          <Typography variant="h5">Accounts balance change</Typography>
        </Box>
        <List>
          {accounts.map(account => (
            <List.Item key={account.id}>
              <List.ItemRow>
                {account.name}
                <Box marginLeft="auto">
                  <FormattedAmount amount={account.amount} />
                </Box>
              </List.ItemRow>
            </List.Item>
          ))}
        </List>
      </>
    )
  }
}
