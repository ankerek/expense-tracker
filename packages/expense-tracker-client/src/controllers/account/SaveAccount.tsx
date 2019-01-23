import React from 'react'
import { ChildMutateProps, withApollo, WithApolloClient } from 'react-apollo'
import { normalizeErrors, NormalizedErrorsMap } from '@utils/normalizeErrors'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { compose } from '@utils/compose'

export interface CreateUpdateAccountProps<AccountMutationVariables> {
  variables?: Partial<AccountMutationVariables>
  children: (
    data: {
      submit: (
        values: AccountMutationVariables
      ) => Promise<NormalizedErrorsMap | null>
    }
  ) => JSX.Element | null
}

class C<AccountMutation, AccountMutationVariables> extends React.PureComponent<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<CreateUpdateAccountProps<AccountMutationVariables>>,
      AccountMutation,
      AccountMutationVariables
    >
> {
  submit = async (values: AccountMutationVariables) => {
    try {
      const {
        mutate,
        variables = {},
        history,
        location: { state },
      } = this.props

      await mutate({
        variables: cleanPropertiesBeforeMutation(
          Object.assign(variables, values)
        ),
      })

      if (state && state.next) {
        history.push(state.next)
      } else {
        history.push('/')
      }
    } catch (res) {
      console.log(res)
      const errors = normalizeErrors(res.graphQLErrors)
      return { errors }
    }

    return null
  }

  render() {
    return this.props.children({ submit: this.submit })
  }
}

export const SaveAccount = compose(
  withRouter,
  withApollo
)(C)
