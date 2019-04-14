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
import robotoEot from '@assets/fonts/roboto-v19-latin-regular.eot'
import robotoWoff from '@assets/fonts/roboto-v19-latin-regular.woff'
import robotoWoff2 from '@assets/fonts/roboto-v19-latin-regular.woff2'
import robotoTtf from '@assets/fonts/roboto-v19-latin-regular.ttf'
import robotoSvg from '@assets/fonts/roboto-v19-latin-regular.svg'

const textPrimaryColor = 'rgba(0, 0, 0, 0.87)'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-display: swap;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url('${robotoEot}'); /* IE9 Compat Modes */
    src: local('Roboto'), local('Roboto-Regular'),
         url('${robotoEot}?#iefix') format('embedded-opentype'), /* IE6-IE8 */
         url('${robotoWoff2}') format('woff2'), /* Super Modern Browsers */
         url('${robotoWoff}') format('woff'), /* Modern Browsers */
         url('${robotoTtf}') format('truetype'), /* Safari, Android, iOS */
         url('${robotoSvg}#Roboto') format('svg'); /* Legacy iOS */
  }

  body {
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
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
              <GlobalStyle />
              <CssBaseline />
              {this.props.children}
            </>
          </MuiPickersUtilsProvider>
        </StyledThemeProvider>
      </MuiThemeProvider>
    )
  }
}
