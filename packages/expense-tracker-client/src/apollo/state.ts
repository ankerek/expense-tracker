import { client } from '@apollo/initializeApollo'
import { getCurrentUserQuery } from '@modules/user/GetCurrentUser'
import { GetCurrentUserQuery } from '@schema-types'

export const getCurrentUserData = () => {
  const data: GetCurrentUserQuery = client.readQuery({
    query: getCurrentUserQuery,
  })

  return data && data.getCurrentUser
}
