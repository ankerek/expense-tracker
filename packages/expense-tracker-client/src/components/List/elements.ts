import styled from 'styled-components'

export const Wrapper = styled.div`
  margin: 10px 0;
`

export const Item = styled.div<{ gray?: boolean }>`
  padding: 10px 20px;
  background: ${props => (props.gray ? '#F8F8F8' : 'white')};
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`

export const ItemRow = styled.div`
  display: flex;
`
