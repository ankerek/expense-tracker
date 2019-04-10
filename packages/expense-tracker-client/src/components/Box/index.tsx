import styled from 'styled-components'

export const Box = styled.div<{
  margin?: string
  marginLeft?: string
  marginRight?: string
  width?: string
  height?: string
  centerAll?: boolean
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

    if (props.width) {
      styles += `width: ${props.width};`
    }

    if (props.height) {
      styles += `height: ${props.height};`
    }

    if (props.centerAll) {
      styles += `
        display: flex;
        align-items: center;
        justify-content: center;
      `
    }

    return styles
  }}
`
