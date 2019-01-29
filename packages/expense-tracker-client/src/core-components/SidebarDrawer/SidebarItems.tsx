import React from 'react'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'
import { NavLink } from '@core-components/NavLink'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import InboxIcon from '@material-ui/icons/Inbox'
import DnsIcon from '@material-ui/icons/Dns'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { SidebarItemText } from './elements'

export class SidebarItems extends React.PureComponent {
  render() {
    return (
      <>
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
        <GetCurrentUser>
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
      </>
    )
  }
}
