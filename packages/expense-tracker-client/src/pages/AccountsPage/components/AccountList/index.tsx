import React from 'react'
import { Account, Transaction } from '@schema-types'
import { RouteComponentProps, withRouter } from 'react-router'
import { sum } from '@utils/math'
import { ItemNotPersistedIndicator } from '@components/ItemNotPersistedIndicator'
import { FormattedAmount } from '@components/FormattedAmount'
import { Button } from '@components/Button'
import { EmptyState } from '@components/EmptyState'
import { OutsideActionsWrapper } from './elements'
import { List } from '@components/List'
import { Box } from '@components/Box'

interface AccountListProps {
  accounts: Account[]
  transactions: Transaction[]
  subscribeAccounts?: () => void
  subscribeTransactions?: () => void
}

class C extends React.PureComponent<AccountListProps & RouteComponentProps> {
  componentDidMount() {
    if (this.props.subscribeAccounts) {
      this.props.subscribeAccounts()
    }
    if (this.props.subscribeTransactions) {
      this.props.subscribeTransactions()
    }
  }

  render() {
    const { accounts, transactions, history } = this.props
    return (
      <>
        <List>
          {accounts.length ? (
            accounts.map(account => (
              <List.Item
                key={account.id}
                gray={!account.isPersisted}
                onClick={() =>
                  history.push({
                    pathname: `/accounts/${account.id}`,
                    state: { next: '/accounts' },
                  })
                }
              >
                <List.ItemRow>
                  {account.name}
                  {!account.isPersisted && (
                    <ItemNotPersistedIndicator compact={true} />
                  )}
                  <Box marginLeft="auto">
                    <FormattedAmount
                      amount={transactions.reduce((acc, curr) => {
                        if (curr.account.id === account.id) {
                          acc = sum(acc, curr.amount)
                        }
                        return acc
                      }, 0)}
                    />
                  </Box>
                </List.ItemRow>
              </List.Item>
            ))
          ) : (
            <EmptyState title="There are no accounts" />
          )}
        </List>
        <OutsideActionsWrapper>
          <Button.Link
            to={{
              pathname: '/accounts/create',
              state: { next: '/accounts' },
            }}
            variant="contained"
            color="primary"
          >
            Create new account
          </Button.Link>
        </OutsideActionsWrapper>
      </>
    )
  }
}

export const AccountList = withRouter(C)
