import React from 'react'
import { Wrapper, Item, ItemRow } from './elements'

export class List extends React.Component {
  static Item = Item
  static ItemRow = ItemRow

  render() {
    const { children } = this.props
    return <Wrapper>{children}</Wrapper>
  }
}
