import React from 'react'
import MuiButton, {
  ButtonProps as MuiButtonProps,
} from '@material-ui/core/Button'
import { ButtonLink } from '@core-components/Button/ButtonLink'
import { Progress } from './elements'

interface ButtonProps extends MuiButtonProps {
  progress?: boolean
}

export class Button extends React.PureComponent<ButtonProps> {
  static Link = ButtonLink

  render() {
    const { children, progress, disabled, ...otherProps } = this.props
    return (
      <MuiButton {...otherProps} disabled={disabled || progress}>
        {children}
        {progress && <Progress size={24} />}
      </MuiButton>
    )
  }
}
