import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { CreateUser } from './controllers/CreateUser'
import { SignUpForm } from './components/SignUpForm'
import { GetCurrencyList } from '@controllers/currency/GetCurrencyList'

export const SignUpPage = () => (
  <PageLayout title="Sign up">
    <GetCurrencyList>
      {({ data }) =>
        data && data.getCurrencyList ? (
          <CreateUser>
            {(submit, { loading }) => (
              <SignUpForm
                currencies={data.getCurrencyList}
                submit={submit}
                loading={loading}
              />
            )}
          </CreateUser>
        ) : null
      }
    </GetCurrencyList>
  </PageLayout>
)
