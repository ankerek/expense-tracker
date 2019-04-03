import styled from 'styled-components'

export const Box = styled.div<{
  margin?: string
  marginLeft?: string
  marginRight?: string
}>`
  ${props => {
    let styles = ``
    if (props.margin) {
      styles += `margin: ${props.margin};`
    }

    if (props.marginLeft) {
      styles += `margin-left: ${props.marginLeft};`
    }

    if (props.marginRight) {
      styles += `margin-right: ${props.marginRight};`
    }

    return styles
  }}
`
