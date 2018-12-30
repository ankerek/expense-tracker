import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { AccountForm } from '@core-components/AccountForm'
import { GetAccount } from '@controllers/account/GetAccount'
import { UpdateAccount } from '@controllers/account/UpdateAccount'

export class AccountPage extends React.Component {
  render() {
    return (
      <PageLayout title="Account" hasGoBack>
        <GetAccount>
          {({ data }) => (
            <>
              {data && data.getAccount && (
                <UpdateAccount>
                  {({ submit }) => (
                    <AccountForm
                      initialValues={data.getAccount}
                      submit={submit}
                    />
                  )}
                </UpdateAccount>
              )}
            </>
          )}
        </GetAccount>
      </PageLayout>
    )
  }
}
