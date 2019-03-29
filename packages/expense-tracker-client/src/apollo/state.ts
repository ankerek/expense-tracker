import { client } from '@apollo/initializeApollo'
import { getCurrentUserQuery } from '@controllers/user/GetCurrentUser'
import { GetCurrentUserQuery } from '@schema-types'

export const getCurrentUserData = () => {
  const data: GetCurrentUserQuery = client.readQuery({
    query: getCurrentUserQuery,
  })

  return data && data.getCurrentUser
}
