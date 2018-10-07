import { User } from '../modules/user/definitions/User'

declare global {
  interface Context {
    user?: Partial<User>
  }
}
