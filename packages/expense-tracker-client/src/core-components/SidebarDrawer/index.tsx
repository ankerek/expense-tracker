import React from 'react'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer/Drawer'
import Hidden from '@material-ui/core/Hidden'
import { SidebarItems } from './SidebarItems'
import { AppVersion } from '@core-components/AppVersion'

interface SidebarDrawerProps {
  drawerOpen: boolean
  handleToggleDrawer: () => void
}

const temporaryPaperClassName = 'temporaryPaper'
const permanentPaperClassName = 'permanentPaper'

const DrawerSidebar = styled(Drawer)`
  && {
    .${temporaryPaperClassName} {
      width: 250px;
    }
    .${permanentPaperClassName} {
      width: 250px;
      height: calc(100% - 56px);
      top: 56px;
    }
  }
`

export class SidebarDrawer extends React.PureComponent<SidebarDrawerProps> {
  render() {
    const { drawerOpen, handleToggleDrawer } = this.props

    return (
      <>
        <Hidden smUp implementation="css">
          <DrawerSidebar
            variant="temporary"
            open={drawerOpen}
            onClose={handleToggleDrawer}
            classes={{
              paper: temporaryPaperClassName,
            }}
          >
            <SidebarItems />
            <AppVersion />
          </DrawerSidebar>
        </Hidden>
        <Hidden smDown implementation="css">
          <DrawerSidebar
            variant="permanent"
            classes={{
              paper: permanentPaperClassName,
            }}
            open
          >
            <SidebarItems />
            <AppVersion />
          </DrawerSidebar>
        </Hidden>
      </>
    )
  }
}
