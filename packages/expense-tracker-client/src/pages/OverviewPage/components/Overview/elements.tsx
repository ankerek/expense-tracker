import styled from 'styled-components'

export const ExpenseBoxes = styled.div`
  @media (min-width: ${props => props.theme.breakpoints.values.md}px) {
    display: flex;
  }
`

export const ExpenseBox = styled.div`
  @media (min-width: ${props => props.theme.breakpoints.values.md}px) {
    & + & {
      margin-left: 20px;
    }
    width: 50%;
  }
`
