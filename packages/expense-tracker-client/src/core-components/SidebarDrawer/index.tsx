import React from 'react'
import styled from 'styled-components'
import cn from 'classnames'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'
import Drawer from '@material-ui/core/Drawer/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import InboxIcon from '@material-ui/icons/Inbox'
import DnsIcon from '@material-ui/icons/Dns'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { SidebarItemText } from './elements'
import { NavLink } from '@core-components/NavLink'

interface SidebarDrawerProps {
  drawerOpen: boolean
  handleToggleDrawer: () => void
}

const paperClassName = 'paper'
const paperClosedClassName = 'paperClosed'

const DrawerSidebar = styled(Drawer)`
  && {
    .${paperClassName} {
      width: 250px;

      @media (min-width: ${props => props.theme.breakpoints.values.md}px) {
        position: relative;
      }
    }

    .${paperClosedClassName} {
      display: none;

      @media (min-width: ${props => props.theme.breakpoints.values.md}px) {
        display: block;
      }
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
          <SidebarItemText primary="Inbox" />
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
          <SidebarItemText primary="Accounts" />
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
          <SidebarItemText primary="Transactions" />
        </ListItem>
        <GetCurrentUser fetchPolicy="cache-first">
          {({ data }) =>
            data && data.getCurrentUser ? (
              <ListItem
                button
                component={({ innerRef, ...props }) => (
                  <NavLink {...props} to="/signout" />
                )}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <SidebarItemText primary="Sign out" />
              </ListItem>
            ) : null
          }
        </GetCurrentUser>
      </DrawerSidebar>
    )
  }
}
