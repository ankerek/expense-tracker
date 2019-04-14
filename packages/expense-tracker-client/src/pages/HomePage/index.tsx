import React from 'react'
import { PageLayout } from '@components/PageLayout'
import Typography from '@material-ui/core/Typography'

export default class HomePage extends React.Component {
  render() {
    return (
      <PageLayout title="Home">
        <Typography variant="h4">Home</Typography>
      </PageLayout>
    )
  }
}
