import styled from 'styled-components'
import { Form as FormikForm } from 'formik'

export const Form = styled(FormikForm)`
  padding: 0 20px;

  @media (min-width: ${props => props.theme.breakpoints.values.md}px) {
    padding: 0;
  }
`
