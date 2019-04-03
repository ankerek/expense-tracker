import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import Typography from '@material-ui/core/Typography'
import { GetTransactionList } from '@modules/transaction/GetTransactionList'
import { Overview } from '@pages/OverviewPage/components/Overview'

export const OverviewPage = () => (
  <PageLayout title="Overview">
    <Typography variant="h4">Overview</Typography>
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
