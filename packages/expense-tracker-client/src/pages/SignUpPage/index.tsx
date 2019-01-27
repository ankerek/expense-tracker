import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { CreateUser } from './controllers/CreateUser'
import { SignUpForm } from './components/SignUpForm'
import { GetCurrencyList } from '@controllers/currency/GetCurrencyList'

export const SignUpPage = () => (
  <PageLayout title="Sign up">
    <GetCurrencyList>
      {({ data: { getCurrencyList } }) =>
        getCurrencyList ? (
          <CreateUser>
            {({ submit }) => (
              <SignUpForm submit={submit} currencies={getCurrencyList} />
            )}
          </CreateUser>
        ) : null
      }
    </GetCurrencyList>
  </PageLayout>
)
