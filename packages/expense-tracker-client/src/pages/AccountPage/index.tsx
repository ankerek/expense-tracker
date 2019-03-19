import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { AccountForm } from '@core-components/AccountForm'
import { GetAccount } from '@controllers/account/GetAccount'
import { UpdateAccount } from '@controllers/account/UpdateAccount'
import { ItemNotPersistedIndicator } from '@core-components/ItemNotPersistedIndicator'
import { CreateAccount } from '@controllers/account/CreateAccount'

export class AccountPage extends React.Component {
  render() {
    return (
      <PageLayout title="Account" hasGoBack>
        <GetAccount>
          {({ data }) => {
            const account = data && data.getAccount
            return account ? (
              <>
                {!account.isPersisted && <ItemNotPersistedIndicator />}
                <CreateAccount>
                  {(submit, { loading }) => (
                    <AccountForm
                      initialValues={data.getAccount}
                      submit={submit}
                      hasDelete
                      loading={loading}
                    />
                  )}
                </CreateAccount>
              </>
            ) : null
          }}
        </GetAccount>
      </PageLayout>
    )
  }
}
