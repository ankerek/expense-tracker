import React from 'react'
import { GetCurrentUser } from '@modules/user/GetCurrentUser'
import { NavLink } from '@components/NavLink'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import InboxIcon from '@material-ui/icons/Inbox'
import DnsIcon from '@material-ui/icons/Dns'
import AllInboxIcon from '@material-ui/icons/AllInbox'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { SidebarItemText } from './elements'
import { SignOut } from '@modules/user/SignOut'

export class SidebarItems extends React.PureComponent {
  render() {
    return (
      <>
        <ListItem
          button
          component={({ innerRef, ...props }) => <NavLink {...props} to="/" />}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <SidebarItemText primary="Overview" />
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
            <NavLink {...props} to="/categories" />
          )}
        >
          <ListItemIcon>
            <AllInboxIcon />
          </ListItemIcon>
          <SidebarItemText primary="Categories" />
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
              <SignOut>
                {({ signOut }) => (
                  <ListItem button onClick={signOut}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <SidebarItemText primary="Sign out" />
                  </ListItem>
                )}
              </SignOut>
            ) : null
          }
        </GetCurrentUser>
      </>
    )
  }
}
