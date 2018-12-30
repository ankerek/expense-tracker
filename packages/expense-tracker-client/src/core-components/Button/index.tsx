import React from 'react'
import MuiButton, { ButtonProps } from '@material-ui/core/Button'
import { ButtonLink } from '@core-components/Button/ButtonLink'

export class Button extends React.PureComponent<ButtonProps> {
  static Link = ButtonLink

  render() {
    return <MuiButton {...this.props} />
  }
}
