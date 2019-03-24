import React from 'react'
import { GetTransactionListQuery_getTransactionList } from '@schema-types'
import {
  Amount,
  Wrapper,
  Item,
  ItemRow,
  OutsideActionsWrapper,
} from './elements'
import Divider from '@material-ui/core/Divider'
import { FormattedAmount } from '@core-components/FormattedAmount'
import { Button } from '@core-components/Button'
import { NavLink } from '@core-components/NavLink'
import { ItemNotPersistedIndicator } from '@core-components/ItemNotPersistedIndicator'
import { EmptyState } from '@core-components/EmptyState'
import Typography from '@material-ui/core/Typography'

interface AccountListProps {
  transactions: GetTransactionListQuery_getTransactionList[]
}

export class TransactionList extends React.Component<AccountListProps> {
  render() {
    const { transactions } = this.props
    return (
      <>
        <Wrapper>
          {transactions.length ? (
            transactions.map(transaction => (
              <div key={transaction.id}>
                <Item isNotPersisted={!transaction.isPersisted}>
                  <ItemRow>
                    <NavLink
                      to={{
                        pathname: `/transactions/${transaction.id}`,
                        state: { next: '/transactions' },
                      }}
                    >
                      {transaction.category.name}
                    </NavLink>
                    {!transaction.isPersisted && (
                      <ItemNotPersistedIndicator compact={true} />
                    )}
                    <Amount>
                      <FormattedAmount>{transaction.amount}</FormattedAmount>
                    </Amount>
                  </ItemRow>
                  <ItemRow>
                    {transaction.description !== '' && (
                      <Typography color="textSecondary">
                        {transaction.description}
                      </Typography>
                    )}
                  </ItemRow>
                </Item>
                <Divider light />
              </div>
            ))
          ) : (
            <EmptyState title="There are no transactions" />
          )}
        </Wrapper>
        <OutsideActionsWrapper>
          <Button.Link
            to={{
              pathname: '/transactions/create',
              state: { next: '/transactions' },
            }}
            variant="contained"
            color="primary"
          >
            Create new transaction
          </Button.Link>
        </OutsideActionsWrapper>
      </>
    )
  }
}

// TODO: create and use FormattedAmount component
