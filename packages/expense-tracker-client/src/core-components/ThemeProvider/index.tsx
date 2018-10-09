import * as React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  ThemeProvider as StyledThemeProvider,
  injectGlobal,
} from 'styled-components'
import CssBaseline from '@material-ui/core/CssBaseline'
import blue from '@material-ui/core/colors/blue'
import pink from '@material-ui/core/colors/pink'

const textPrimaryColor = 'rgba(0, 0, 0, 0.87)'

injectGlobal`
  body {
    font-family: Roboto;
    color: ${textPrimaryColor};
}
`

const themeOptions = {
  palette: {
    primary: blue,
    secondary: pink,
  },
  text: {
    primary: textPrimaryColor,
    secondary: 'rgba(0, 0, 0, 0.54)',
  },
  typography: {
    useNextVariants: true,
  },
}
const theme = createMuiTheme(themeOptions)

export class ThemeProvider extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <StyledThemeProvider theme={themeOptions}>
          <>
            <CssBaseline />
            {this.props.children}
          </>
        </StyledThemeProvider>
      </MuiThemeProvider>
    )
  }
}
