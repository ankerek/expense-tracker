import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { GetAccountList } from '@pages/AccountsPage/controllers/AccountList'
import { AccountList } from '@pages/AccountsPage/components/AccountList'

export class AccountsPage extends React.Component {
  render() {
    return (
      <div>
        <Typography variant="display1">Accounts</Typography>
        <GetAccountList>
          {({ data }) =>
            data.getAccountList ? <AccountList accounts={data.getAccountList} /> : null
          }
        </GetAccountList>
      </div>
    )
  }
}
