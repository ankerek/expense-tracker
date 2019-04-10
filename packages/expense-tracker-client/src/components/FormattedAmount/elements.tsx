import styled from 'styled-components'

export const Amount = styled.span<{ children: number }>`
  color: ${props => (props.children < 0 ? '#f44336' : '#4caf50')};
`
