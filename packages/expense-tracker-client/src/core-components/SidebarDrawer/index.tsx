import React from 'react'
import cn from 'classnames'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'
import Drawer from '@material-ui/core/Drawer/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import InboxIcon from '@material-ui/icons/Inbox'
import DnsIcon from '@material-ui/icons/Dns'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import styled from 'styled-components'
import { NavLink } from '@core-components/NavLink'

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
      width: 60px;
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
        <ListItem
          button
          component={({ innerRef, ...props }) => (
            <NavLink {...props} to="/accounts" />
          )}
        >
          <ListItemIcon>
            <DnsIcon />
          </ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItem>
        <ListItem
          button
          component={({ innerRef, ...props }) => (
            <NavLink {...props} to="/transactions" />
          )}
        >
          <ListItemIcon>
            <MonetizationOnIcon />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItem>
        <GetCurrentUser fetchPolicy="cache-first">
          {({ data: { getCurrentUser } }) =>
            getCurrentUser ? (
              <ListItem
                button
                component={({ innerRef, ...props }) => (
                  <NavLink {...props} to="/signout" />
                )}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItem>
            ) : null
          }
        </GetCurrentUser>
      </DrawerSidebar>
    )
  }
}
