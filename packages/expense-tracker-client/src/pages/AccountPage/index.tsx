import React from 'react'
import { SaveAccount } from '@controllers/account/SaveAccount'
import { GetAccount } from '@controllers/account/GetAccount'
import { PageLayout } from '@core-components/PageLayout'
import { AccountForm } from '@core-components/AccountForm'
import { ItemNotPersistedIndicator } from '@core-components/ItemNotPersistedIndicator'

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
                <SaveAccount>
                  {(submit, { loading }) => (
                    <AccountForm
                      initialValues={data.getAccount}
                      submit={submit}
                      hasDelete
                      loading={loading}
                    />
                  )}
                </SaveAccount>
              </>
            ) : null
          }}
        </GetAccount>
      </PageLayout>
    )
  }
}
