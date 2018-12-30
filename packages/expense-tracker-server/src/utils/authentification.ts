import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../modules/user/definitions/User'
import { Request } from 'express'

export const createToken = (user: User, expiresIn: string | number) => {
  const { id, email } = user
  return jwt.sign({ id, email }, process.env.SECRET, {
    expiresIn,
  })
}

export const validatePassword = async (
  userPassword: string,
  inputPassword: string
) => bcrypt.compare(userPassword, inputPassword)

export const getCurrentUser = (req: Request) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace('Bearer ', '')
    : undefined

  if (token) {
    try {
      return jwt.verify(token, process.env.SECRET) as Partial<User>
    } catch (e) {
      return null
    }
  }
  return null
}
