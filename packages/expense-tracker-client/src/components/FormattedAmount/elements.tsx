import styled from 'styled-components'

export const Amount = styled.span<{ color?: string; children: number }>`
  color: ${props => (props.children < 0 ? '#f44336' : '#4caf50')};
  color: ${props => props.color};
`
