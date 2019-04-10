import React from 'react'
import { PageLayout } from '@components/PageLayout'
import { SignUpForm } from './components/SignUpForm'
import { CreateUser } from '@modules/user/CreateUser'
import { GetCurrencyList } from '@modules/currency/GetCurrencyList'

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
