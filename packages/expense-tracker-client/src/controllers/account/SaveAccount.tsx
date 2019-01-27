import React from 'react'
import { ChildMutateProps, withApollo, WithApolloClient } from 'react-apollo'
import { normalizeErrors, NormalizedErrorsMap } from '@utils/normalizeErrors'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { compose } from '@utils/compose'

export interface CreateUpdateAccountProps<AccountMutationVariables> {
  variables?: Partial<AccountMutationVariables>
  children: (
    submit: (
      values: AccountMutationVariables
    ) => Promise<NormalizedErrorsMap | null>,
    data: {
      loading: boolean
    }
  ) => JSX.Element | null
}

const initialState = {
  loading: false,
}

type State = Readonly<typeof initialState>

class C<AccountMutation, AccountMutationVariables> extends React.PureComponent<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<CreateUpdateAccountProps<AccountMutationVariables>>,
      AccountMutation,
      AccountMutationVariables
    >
> {
  readonly state = initialState

  render() {
    return this.props.children(this.submit, {
      loading: this.state.loading,
    })
  }

  private submit = async (values: AccountMutationVariables) => {
    try {
      const {
        mutate,
        variables = {},
        history,
        location: { state },
      } = this.props

      this.setState({ loading: true })

      const response = await mutate({
        variables: cleanPropertiesBeforeMutation(
          Object.assign(variables, values)
        ),
      })

      this.setState({ loading: false })

      if (state && state.next) {
        history.push(state.next)
      } else {
        history.push('/')
      }
    } catch (res) {
      const errors = normalizeErrors(res.graphQLErrors)

      this.setState({ loading: false })

      return { errors }
    }

    return null
  }
}

export const SaveAccount = compose(
  withRouter,
  withApollo
)(C)
