// import React from 'react'
// import cn from 'classnames'
// import DatePicker, { DatePickerProps } from 'material-ui-pickers/DatePicker'
// import { RenderDay } from 'material-ui-pickers/DatePicker/components/Calendar'
// import { styles as dayStyles } from 'material-ui-pickers/DatePicker/components/Day'
// import withStyles from '@material-ui/core/styles/withStyles'
//
// interface DateRangePickerProps {
//   value: any
//   onChange: () => void
// }
//
// interface State {
//   range: {
//     start: string
//     end: string
//   }
// }
//
// const initialState: State = {
//   range: {
//     start: null,
//     end: null,
//   },
// }
//
// class C extends React.Component<DateRangePickerProps> {
//   readonly state: Readonly<typeof initialState> = initialState
//
//   handleRenderDay: RenderDay = (
//     day,
//     selectedDate,
//     dayInCurrentMonth,
//     dayComponent
//   ) => {
//     return React.cloneElement(dayComponent, {
//       onClick: (e: React.MouseEvent<any>) => {
//         e.stopPropagation()
//         console.log(e)
//       },
//     })
//   }
//
//   render() {
//     const { value, onChange } = this.props
//
//     return (
//       <DatePicker
//         format="YYYY-MM-dd"
//         value={value}
//         onChange={onChange}
//         renderDay={this.handleRenderDay}
//       />
//     )
//   }
// }
//
// const styles = theme => {
//   const base = dayStyles(theme)
//   return {
//     ...base,
//     day: {
//       ...base.day,
//       margin: 0,
//       width: '40px',
//       borderRadius: '0'
//     },
//     beginCap: {
//       borderRadius: '50% 0 0 50%'
//     },
//     endCap: {
//       borderRadius: '0 50% 50% 0'
//     }
//   }
// }
//
// export const DateRangePicker = withStyles(styles, { name: 'DateRangePicker' })(C)
