import * as React from 'react'
import { GetAccountListQuery_getAccountList } from '@schema-types'
import {
  Actions,
  Amount,
  Container,
  Item,
  OutsideActionsWrapper,
} from './elements'
import Divider from '@material-ui/core/Divider'
import { FormattedAmount } from '@core-components/FormattedAmount'
import { Button } from '@core-components/Button'

interface AccountListProps {
  accounts: GetAccountListQuery_getAccountList[]
}

export class AccountList extends React.PureComponent<AccountListProps> {
  render() {
    const { accounts } = this.props
    return (
      <>
        <Container>
          {accounts.map(account => (
            <div key={account.id}>
              <Item key={account.id}>
                <span>{account.name}</span>
                <Amount>
                  <FormattedAmount>10 000</FormattedAmount>
                </Amount>
                <Actions>Actions</Actions>
              </Item>
              <Divider light />
            </div>
          ))}
        </Container>
        <OutsideActionsWrapper>
          <Button.Link
            to={{
              pathname: '/accounts/create',
              state: { next: '/accounts' },
            }}
            variant="raised"
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
