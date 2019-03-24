import React from 'react'
import uuid from 'uuid/v4'
import { compose } from '@utils/compose'
import {
  ChildMutateProps,
  graphql,
  MutationOptions,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import {
  Account,
  SaveAccountMutation,
  SaveAccountMutationVariables,
  SaveAccountInput,
} from '@schema-types'
import gql from 'graphql-tag'
import { accountFragment } from '@controllers/account/fragments'
import { RouteComponentProps, withRouter } from 'react-router'
import { NormalizedErrorsMap, normalizeErrors } from '@utils/normalizeErrors'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { getUpdater } from '@controllers/getUpdater'
import { setLocalOperation } from '@controllers/network/localOperations'

export const SaveAccountMutationName = 'SaveAccountMutation'

const saveAccountMutation = gql`
  mutation SaveAccountMutation($input: SaveAccountInput!) {
    saveAccount(input: $input) {
      ...Account
    }
  }
  ${accountFragment}
`

export interface SaveAccountProps {
  children: (
    submit: (
      values: SaveAccountInput,
      prevValues?: SaveAccountInput
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

class C extends React.Component<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<SaveAccountProps>,
      SaveAccountMutation,
      SaveAccountMutationVariables
    >
> {
  readonly state: State = initialState

  render() {
    return this.props.children(this.submit, {
      loading: this.state.loading,
    })
  }

  private submit = async (
    values: SaveAccountInput,
    prevValues?: SaveAccountInput
  ) => {
    const {
      client,
      mutate,
      history,
      location: { state },
    } = this.props
    const operationId = uuid()

    this.setState({ loading: true })

    const optimisticResponse: any = {
      __typename: 'Account',
      ...values,
      isPersisted: false,
    }

    const updaterOtherOptions: any = {
      prevAccount: prevValues,
    }

    const mutationOptions: MutationOptions<
      SaveAccountMutation,
      SaveAccountMutationVariables
    > = {
      variables: cleanPropertiesBeforeMutation({ input: values }),
      optimisticResponse: {
        saveAccount: optimisticResponse,
      },
      update: (proxy, response) =>
        getUpdater(response)(proxy, response, updaterOtherOptions),
      context: {
        operationId,
      },
    }

    const { isOnline } = client.readQuery({
      query: getIsOnlineQuery,
    })

    if (isOnline) {
      try {
        await mutate(mutationOptions)

        this.setState({ loading: false })
      } catch (res) {
        const errors = normalizeErrors(res.graphQLErrors)

        this.setState({ loading: false })

        return { errors }
      }
    } else {
      mutate(mutationOptions)

      setLocalOperation({
        mutationOptions: {
          ...mutationOptions,
          mutation: saveAccountMutation,
        },
        updaterOtherOptions,
      })
    }

    if (state && state.next) {
      history.push(state.next)
    } else {
      history.push('/')
    }

    return null
  }
}

export const SaveAccount = compose<SaveAccountProps>(
  withRouter,
  withApollo,
  graphql<null, SaveAccountMutation, SaveAccountMutationVariables>(
    saveAccountMutation
  )
)(C)
