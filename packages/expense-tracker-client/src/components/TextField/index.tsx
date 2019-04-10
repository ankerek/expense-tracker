import React from 'react'
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core/TextField'
import { FieldProps } from 'formik'

export type TextFieldProps = FieldProps &
  MuiTextFieldProps & {
    parseValue?: (value: any) => string
  }

export const TextField: React.ComponentType<TextFieldProps> = ({
  field,
  form,
  disabled = false,
  parseValue,
  onChange: overwrittenOnChange,
  ...props
}) => {
  const { name, value, onChange } = field
  const { touched, errors, isSubmitting } = form
  const parsedValue = parseValue ? parseValue(value) : value

  return (
    <MuiTextField
      {...props}
      {...field}
      value={parsedValue}
      onChange={overwrittenOnChange ? overwrittenOnChange : onChange}
      error={touched[name] && !!errors[name]}
      helperText={
        touched[name] && errors[name] ? errors[name] : props.helperText
      }
      disabled={isSubmitting || disabled}
    />
  )
}
