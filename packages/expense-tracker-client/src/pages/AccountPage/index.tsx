import React from 'react'
import { SaveAccount } from '@modules/account/SaveAccount'
import { GetAccount } from '@modules/account/GetAccount'
import { PageLayout } from '@components/PageLayout'
import { AccountForm } from '@components/AccountForm'
import { ItemNotPersistedIndicator } from '@components/ItemNotPersistedIndicator'

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
