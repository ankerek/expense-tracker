import { Connection, getRepository, Repository } from 'typeorm'
import faker from 'faker'
import uuid from 'uuid'

import { testConnection } from '../../test-utils/testConnection'
import { gCall } from '../../test-utils/gCall'
import { createMockCategory, createMockUser } from '../../test-utils/mockData'
import { User } from '../user/definitions/User'
import { Category } from './definitions/Category'

const saveCategoryMutation = `
  mutation SaveCategoryMutation($input: SaveCategoryInput!) {
    saveCategory(input: $input) {
      id
      name
    }
  }
`

describe('CategoryResolver', () => {
  let conn: Connection
  let categoryRepository: Repository<Category>
  let defaultUser: User

  beforeAll(async () => {
    conn = await testConnection()
    categoryRepository = getRepository(Category)
    defaultUser = await createMockUser()
  })

  afterAll(async () => {
    await conn.close()
  })

  it('getCategories query', async () => {
    const categories = [
      createMockCategory({
        userId: defaultUser.id,
      }),
      createMockCategory({ userId: defaultUser.id }),
    ]

    await categoryRepository.save(categories)

    const getCategoryListQuery = `
      query GetCategoryListQuery {
        getCategoryList {
          id
          name
        }
      }
    `

    const response = await gCall({
      source: getCategoryListQuery,
      userId: defaultUser.id,
    })

    categories.forEach(category => {
      expect(response.data.getCategoryList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: category.id,
            name: category.name,
          }),
        ])
      )
    })
  })

  it('getCategory query', async () => {
    const category = createMockCategory({
      userId: defaultUser.id,
    })

    await categoryRepository.save(category)

    const getCategoryQuery = `
      query GetCategoryQuery($id: ID!) {
        getCategory(id: $id) {
          id
          name
        }
      }
    `

    const response = await gCall({
      source: getCategoryQuery,
      variableValues: {
        id: category.id,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        getCategory: {
          id: category.id,
          name: category.name,
        },
      },
    })
  })

  it('saveCategory mutation - create category', async () => {
    const category = {
      id: uuid(),
      name: faker.internet.domainName(),
    }

    const response = await gCall({
      source: saveCategoryMutation,
      variableValues: {
        input: category,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        saveCategory: {
          name: category.name,
        },
      },
    })
  })

  it('saveCategory mutation - update category', async () => {
    const category = {
      id: uuid(),
      name: faker.internet.domainName(),
    }

    await gCall({
      source: saveCategoryMutation,
      variableValues: {
        input: category,
      },
      userId: defaultUser.id,
    })

    const updatedCategory = {
      ...category,
      name: faker.internet.domainName(),
    }

    const response = await gCall({
      source: saveCategoryMutation,
      variableValues: {
        input: updatedCategory,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        saveCategory: {
          name: updatedCategory.name,
        },
      },
    })
  })

  it('deleteCategory mutation', async () => {
    const deleteCategoryMutation = `
      mutation DeleteCategoryMutation($id: ID!) {
        deleteCategory(id: $id)
      }
    `

    const category = {
      id: uuid(),
      name: faker.internet.domainName(),
    }

    await gCall({
      source: saveCategoryMutation,
      variableValues: {
        input: category,
      },
      userId: defaultUser.id,
    })

    const response = await gCall({
      source: deleteCategoryMutation,
      variableValues: {
        id: category.id,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        deleteCategory: true,
      },
    })

    const dbCategory = await categoryRepository.findOne(category.id)

    expect(dbCategory).toBeUndefined()
  })
})
