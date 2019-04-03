import React from 'react'
import { GetTransactionListQuery_getTransactionList } from '@schema-types'
import { OutsideActionsWrapper } from './elements'
import { FormattedAmount } from '@core-components/FormattedAmount'
import { Button } from '@core-components/Button'
import { NavLink } from '@core-components/NavLink'
import { ItemNotPersistedIndicator } from '@core-components/ItemNotPersistedIndicator'
import { EmptyState } from '@core-components/EmptyState'
import Typography from '@material-ui/core/Typography'
import { List } from '@core-components/List'
import { Box } from '@core-components/Box'

interface TransactionListProps {
  transactions: GetTransactionListQuery_getTransactionList[]
  subscribe?: () => void
}

export class TransactionList extends React.Component<TransactionListProps> {
  componentDidMount() {
    if (this.props.subscribe) {
      this.props.subscribe()
    }
  }

  render() {
    const { transactions } = this.props
    return (
      <>
        <List>
          {transactions.length ? (
            transactions.map(transaction => (
              <List.Item gray={!transaction.isPersisted} key={transaction.id}>
                <List.ItemRow>
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
                  <Box marginLeft="auto">
                    <FormattedAmount>{transaction.amount}</FormattedAmount>
                  </Box>
                </List.ItemRow>
                <List.ItemRow>
                  {transaction.description !== '' && (
                    <Typography color="textSecondary">
                      {transaction.description}
                    </Typography>
                  )}
                </List.ItemRow>
              </List.Item>
            ))
          ) : (
            <EmptyState title="There are no transactions" />
          )}
        </List>
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
