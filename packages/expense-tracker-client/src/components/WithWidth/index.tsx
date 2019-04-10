import React from 'react'
import withWidth, {
  WithWidth as MUIWithWidth,
} from '@material-ui/core/withWidth'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

interface WithWidthProps {
  children: (data: { width: Breakpoint }) => React.ReactNode
}

class C extends React.Component<WithWidthProps & MUIWithWidth> {
  render() {
    const { width, children } = this.props
    return children({ width })
  }
}

export const WithWidth = withWidth()(C)
