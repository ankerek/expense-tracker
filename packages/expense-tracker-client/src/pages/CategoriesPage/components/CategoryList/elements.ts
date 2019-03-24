import styled from 'styled-components'

export const Wrapper = styled.div`
  margin: 10px 0;
`

export const Item = styled.div<{ isNotPersisted: boolean }>`
  padding: 10px 20px;
  display: flex;
  background: ${props => (props.isNotPersisted ? '#F8F8F8' : 'white')};
`

export const Amount = styled.div`
  margin-left: auto;
`

export const OutsideActionsWrapper = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  justify-content: flex-end;
`
