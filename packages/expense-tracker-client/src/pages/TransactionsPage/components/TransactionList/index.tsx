import React from 'react'
import { GetTransactionListQuery_getTransactionList } from '@schema-types'
import { OutsideActionsWrapper } from './elements'
import { FormattedAmount } from '@components/FormattedAmount'
import { Button } from '@components/Button'
import { NavLink } from '@components/NavLink'
import { ItemNotPersistedIndicator } from '@components/ItemNotPersistedIndicator'
import { EmptyState } from '@components/EmptyState'
import Typography from '@material-ui/core/Typography'
import { List } from '@components/List'
import { Box } from '@components/Box'

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
                    <FormattedAmount amount={transaction.amount} />
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
