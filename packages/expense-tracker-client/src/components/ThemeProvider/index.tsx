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
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'

const textPrimaryColor = 'rgba(0, 0, 0, 0.87)'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Roboto, sans-serif;
    color: ${textPrimaryColor};
  }
  
  html, body, #root {
    height: 100%;
  }
`

const themeOptions: ThemeOptions = {
  palette: {
    primary: blue,
    secondary: pink,
  },
  // text: {
  //   primary: red,
  //   secondary: 'rgba(0, 0, 0, 0.54)',
  // },
  typography: {
    useNextVariants: true,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
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
