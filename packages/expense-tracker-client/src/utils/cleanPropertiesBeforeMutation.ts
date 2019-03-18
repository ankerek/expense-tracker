const PROPERTIES_TO_OMIT = ['__typename', 'isPersisted']

// go through all properties in obj and omit PROPERTIES_TO_OMIT
const omitProperties = (obj: any) => {
  const newObj = { ...obj }
  Object.keys(newObj).forEach(key => {
    if (typeof newObj[key] === 'object' && newObj[key] !== null) {
      newObj[key] = omitProperties(newObj[key])
    } else if (PROPERTIES_TO_OMIT.includes(key)) {
      delete newObj[key]
    }
  })

  return newObj
}

export const cleanPropertiesBeforeMutation = (variables: any) => {
  if (variables.input) {
    return {
      ...variables,
      input: omitProperties(variables.input),
    }
  }

  return variables
}
