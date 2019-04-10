import React from 'react'
import { Account, Transaction } from '@schema-types'
import { sum } from '@utils/math'
import Divider from '@material-ui/core/Divider'
import { ItemNotPersistedIndicator } from '@components/ItemNotPersistedIndicator'
import { FormattedAmount } from '@components/FormattedAmount'
import { Button } from '@components/Button'
import { NavLink } from '@components/NavLink'
import { EmptyState } from '@components/EmptyState'
import { Amount, Wrapper, Item, OutsideActionsWrapper } from './elements'

interface AccountListProps {
  accounts: Account[]
  transactions: Transaction[]
  subscribeAccounts?: () => void
  subscribeTransactions?: () => void
}

export class AccountList extends React.PureComponent<AccountListProps> {
  componentDidMount() {
    if (this.props.subscribeAccounts) {
      this.props.subscribeAccounts()
    }
    if (this.props.subscribeTransactions) {
      this.props.subscribeTransactions()
    }
  }

  render() {
    const { accounts, transactions } = this.props
    return (
      <>
        <Wrapper>
          {accounts.length ? (
            accounts.map(account => (
              <div key={account.id}>
                <Item isNotPersisted={!account.isPersisted}>
                  <NavLink
                    to={{
                      pathname: `/accounts/${account.id}`,
                      state: { next: '/accounts' },
                    }}
                  >
                    {account.name}
                  </NavLink>
                  {!account.isPersisted && (
                    <ItemNotPersistedIndicator compact={true} />
                  )}
                  <Amount>
                    <FormattedAmount
                      amount={transactions.reduce((acc, curr) => {
                        if (curr.account.id === account.id) {
                          acc = sum(acc, curr.amount)
                        }
                        return acc
                      }, 0)}
                    />
                  </Amount>
                </Item>
                <Divider light />
              </div>
            ))
          ) : (
            <EmptyState title="There are no accounts" />
          )}
        </Wrapper>
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

// TODO: create and use FormattedAmount component
