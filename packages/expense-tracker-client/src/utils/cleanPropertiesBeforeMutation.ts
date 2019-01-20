import omit from 'lodash/omit'

// go through all properties in obj and omit `__typename` property
const omitTypename = (obj: any) => {
  const newObj = { ...obj }
  Object.keys(newObj).forEach(key => {
    if (typeof newObj[key] === 'object' && newObj[key] !== null) {
      newObj[key] = omitTypename(newObj[key])
    }
  })
  return newObj['__typename'] ? omit(newObj, ['__typename']) : newObj
}

export const cleanPropertiesBeforeMutation = (variables: any) => {
  if (variables.input) {
    return {
      ...variables,
      input: omitTypename(variables.input),
    }
  }

  return variables
}
