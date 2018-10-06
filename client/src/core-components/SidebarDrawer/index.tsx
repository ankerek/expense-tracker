import * as React from 'react'
import cn from 'classnames'
import Drawer, { DrawerProps } from '@material-ui/core/Drawer/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import InboxIcon from '@material-ui/icons/Inbox'
import styled from 'styled-components'

interface SidebarDrawerProps {
  drawerOpen: boolean
  handleToggleDrawer: () => void
}

const paperClassName = 'paper'
const paperClosedClassName = 'paperClosed'
export const DRAWER_WIDTH = '250px'

const DrawerSidebar = styled(Drawer)`
  && {
    .${paperClassName} {
      position: relative;
      width: 250px;
    }

    .${paperClosedClassName} {
      width: 80px;
      overflow-x: hidden;
    }
  }
`

export class SidebarDrawer extends React.PureComponent<SidebarDrawerProps> {
  render() {
    const { drawerOpen, handleToggleDrawer } = this.props
    return (
      <DrawerSidebar
        variant="permanent"
        open={drawerOpen}
        classes={{
          paper: cn(paperClassName, !drawerOpen && paperClosedClassName),
        }}
      >
        <Toolbar>
          <IconButton onClick={handleToggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>
      </DrawerSidebar>
    )
  }
}
