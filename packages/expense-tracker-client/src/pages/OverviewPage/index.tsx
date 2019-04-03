import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { GetTransactionList } from '@modules/transaction/GetTransactionList'
import { Overview } from '@pages/OverviewPage/components/Overview'

export const OverviewPage = () => (
  <PageLayout title="Overview">
    <GetTransactionList>
      {({ data, subscribe }) =>
        data && data.getTransactionList ? (
          <Overview
            transactions={data.getTransactionList}
            subscribe={subscribe}
          />
        ) : null
      }
    </GetTransactionList>
  </PageLayout>
)