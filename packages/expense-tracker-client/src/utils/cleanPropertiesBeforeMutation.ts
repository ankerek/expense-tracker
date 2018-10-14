import omit from 'lodash/omit'

export const cleanPropertiesBeforeMutation = (variables: any) => {
  if (variables.input) {
    return {
      ...variables,
      input: omit(variables.input, ['id', '__typename']),
    }
  }

  return variables
}
