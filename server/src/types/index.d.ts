import { User } from '../modules/users/definitions/User'

declare global {
  interface Context {
    user?: Partial<User>
  }
}
