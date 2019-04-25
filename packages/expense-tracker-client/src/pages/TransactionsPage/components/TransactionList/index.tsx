import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { GetTransactionListQuery_getTransactionList } from '@schema-types'
import compareDesc from 'date-fns/compareDesc'
import { formatDateString, parseDateString } from '@utils/date'
import { OutsideActionsWrapper } from './elements'
import { FormattedAmount } from '@components/FormattedAmount'
import { Button } from '@components/Button'
import { ItemNotPersistedIndicator } from '@components/ItemNotPersistedIndicator'
import { EmptyState } from '@components/EmptyState'
import Typography from '@material-ui/core/Typography'
import { List } from '@components/List'
import { Box } from '@components/Box'

interface TransactionListProps {
  transactions: GetTransactionListQuery_getTransactionList[]
  subscribe?: () => void
}

export class C extends React.Component<
  TransactionListProps & RouteComponentProps
> {
  render() {
    const { transactions, history } = this.props
    const createButton = (
      <Button.Link
        to={{
          pathname: '/transactions/create',
          state: { next: '/transactions' },
        }}
        variant="contained"
        color="primary"
      >
        Add new transaction
      </Button.Link>
    )
    return (
      <>
        {!!transactions.length && (
          <OutsideActionsWrapper>{createButton}</OutsideActionsWrapper>
        )}
        <List>
          {transactions.length ? (
            transactions
              .sort((a, b) =>
                compareDesc(
                  parseDateString(a.createdAt),
                  parseDateString(b.createdAt)
                )
              )
              .map(transaction => (
                <List.Item
                  key={transaction.id}
                  gray={!transaction.isPersisted}
                  onClick={() =>
                    history.push({
                      pathname: `/transactions/${transaction.id}`,
                      state: { next: '/transactions' },
                    })
                  }
                >
                  <List.ItemRow>
                    {transaction.category.name}
                    {!transaction.isPersisted && (
                      <ItemNotPersistedIndicator compact={true} />
                    )}
                    <Box marginLeft="auto">
                      <FormattedAmount amount={transaction.amount} />
                    </Box>
                  </List.ItemRow>
                  <List.ItemRow>
                    <Typography color="textSecondary">
                      {formatDateString(transaction.createdAt, 'PP')}&nbsp;
                      {transaction.description}
                    </Typography>
                  </List.ItemRow>
                </List.Item>
              ))
          ) : (
            <EmptyState title="There are no transactions" body={createButton} />
          )}
        </List>
      </>
    )
  }
}

export const TransactionList = withRouter(C)
