import React from 'react'
import { PageLayout } from '@components/PageLayout'
import { EmptyState } from '@components/EmptyState'
import { Button } from '@components/Button'

const initialState = {
  hasError: false,
}

type State = Readonly<typeof initialState>

export class ErrorBoundary extends React.Component {
  readonly state: State = initialState

  componentDidCatch() {
    this.setState({
      hasError: true,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <PageLayout title="Expense tracker">
          <EmptyState
            title="Oops! Something went wrong!"
            body={
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  location.reload()
                }}
              >
                Reload app
              </Button>
            }
          />
        </PageLayout>
      )
    }

    return this.props.children
  }
}
