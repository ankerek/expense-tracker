import React from 'react'
import { GetAccountListQuery_getAccountList, Transaction } from '@schema-types'
import { Amount, Wrapper, Item, OutsideActionsWrapper } from './elements'
import Divider from '@material-ui/core/Divider'
import { ItemNotPersistedIndicator } from '@core-components/ItemNotPersistedIndicator'
import { FormattedAmount } from '@core-components/FormattedAmount'
import { Button } from '@core-components/Button'
import { NavLink } from '@core-components/NavLink'
import { EmptyState } from '@core-components/EmptyState'
import { GetTransactionList } from '@modules/transaction/GetTransactionList'
import { subscribe } from 'graphql'

interface AccountListProps {
  accounts: GetAccountListQuery_getAccountList[]
  subscribe?: () => void
}

export class AccountList extends React.PureComponent<AccountListProps> {
  componentDidMount() {
    if (this.props.subscribe) {
      this.props.subscribe()
    }
  }

  render() {
    const { accounts } = this.props
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
                    <FormattedAmount>{account.amount}</FormattedAmount>
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
