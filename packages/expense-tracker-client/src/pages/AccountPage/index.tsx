import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { AccountForm } from '@core-components/AccountForm'
import { GetAccount } from '@controllers/account/GetAccount'
import { UpdateAccount } from '@controllers/account/UpdateAccount'
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
                <UpdateAccount>
                  {(submit, { loading }) => (
                    <AccountForm
                      initialValues={data.getAccount}
                      submit={submit}
                      hasDelete
                      loading={loading}
                    />
                  )}
                </UpdateAccount>
              </>
            ) : null
          }}
        </GetAccount>
      </PageLayout>
    )
  }
}
