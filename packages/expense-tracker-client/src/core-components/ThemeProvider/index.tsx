import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from 'styled-components'
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider'
import CssBaseline from '@material-ui/core/CssBaseline'
import blue from '@material-ui/core/colors/blue'
import pink from '@material-ui/core/colors/pink'

const textPrimaryColor = 'rgba(0, 0, 0, 0.87)'

const GlobalStyle = createGlobalStyle`
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <>
              <CssBaseline />
              <GlobalStyle />
              {this.props.children}
            </>
          </MuiPickersUtilsProvider>
        </StyledThemeProvider>
      </MuiThemeProvider>
    )
  }
}
