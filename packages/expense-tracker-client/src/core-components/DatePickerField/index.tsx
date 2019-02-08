import React from 'react'
import format from 'date-fns/format'
import { FieldProps } from 'formik'
import DatePicker, { DatePickerProps } from 'material-ui-pickers/DatePicker'

export const DATE_FORMAT = 'YYYY-MM-dd'

export type DatePickerFieldProps = FieldProps & DatePickerProps

export class DatePickerField extends React.Component<DatePickerFieldProps> {
  render() {
    const { field, ...restProps } = this.props
    return (
      <DatePicker
        format={DATE_FORMAT}
        autoOk={true}
        showTodayButton={true}
        {...restProps}
        {...field}
        onChange={this.handleChange}
      />
    )
  }

  private handleChange = (value: Date) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = this.props
    setFieldValue(name, format(value, DATE_FORMAT))
  }
}
