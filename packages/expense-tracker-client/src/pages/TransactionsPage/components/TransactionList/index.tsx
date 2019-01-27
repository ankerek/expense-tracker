import React from 'react'
import { GetTransactionListQuery_getTransactionList } from '@schema-types'
import {
  Actions,
  Amount,
  Wrapper,
  Item,
  OutsideActionsWrapper,
} from './elements'
import Divider from '@material-ui/core/Divider'
import { FormattedAmount } from '@core-components/FormattedAmount'
import { Button } from '@core-components/Button'
import { NavLink } from '@core-components/NavLink'

interface AccountListProps {
  transactions: GetTransactionListQuery_getTransactionList[]
}

export class TransactionList extends React.PureComponent<AccountListProps> {
  render() {
    const { transactions } = this.props
    return (
      <>
        <Wrapper>
          {transactions.map(transaction => (
            <div key={transaction.id}>
              <Item>
                <NavLink
                  to={{
                    pathname: `/transactions/${transaction.id}`,
                    state: { next: '/transactions' },
                  }}
                >
                  {transaction.id}
                </NavLink>
                <Amount>
                  <FormattedAmount>{transaction.amount}</FormattedAmount>
                </Amount>
                <Actions>Actions</Actions>
              </Item>
              <Divider light />
            </div>
          ))}
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
