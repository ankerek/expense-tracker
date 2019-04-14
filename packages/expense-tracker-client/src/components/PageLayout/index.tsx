import React from 'react'
import { compose } from '@utils/compose'
import { withRouter, RouteComponentProps } from 'react-router'
import {
  withCurrentUser,
  WithCurrentUserInjectedProps,
} from '@modules/user/withCurrentUser'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { SidebarDrawer } from '@components/SidebarDrawer'
import {
  AppBar,
  Toolbar,
  MainContent,
  ToolbarLeftIcon,
  Wrapper,
  ToolbarLeftIconEmpty,
} from './elements'
import { WithWidth } from '@components/WithWidth'
import { OfflineIndicator } from '@components/OfflineIndicator'

interface PageLayoutProps {
  title?: React.ReactNode
  hasGoBack?: boolean
}

interface PageLayoutState {
  drawerOpen: boolean
}

class C extends React.Component<
  PageLayoutProps & RouteComponentProps & WithCurrentUserInjectedProps,
  PageLayoutState
> {
  state = {
    drawerOpen: false,
  }

  handleToggleDrawer = () => {
    this.setState(({ drawerOpen }) => ({ drawerOpen: !drawerOpen }))
  }

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    const { title, hasGoBack, currentUser, children } = this.props
    const { drawerOpen } = this.state

    return (
      <Wrapper>
        <AppBar drawerOpen={drawerOpen}>
          <Toolbar>
            {currentUser && (
              <>
                {hasGoBack ? (
                  <ToolbarLeftIcon onClick={this.goBack}>
                    <ChevronLeftIcon />
                  </ToolbarLeftIcon>
                ) : (
                  <WithWidth>
                    {({ width }) =>
                      width === 'sm' || width === 'xs' ? (
                        <ToolbarLeftIcon onClick={this.handleToggleDrawer}>
                          <MenuIcon />
                        </ToolbarLeftIcon>
                      ) : (
                        <ToolbarLeftIconEmpty />
                      )
                    }
                  </WithWidth>
                )}
              </>
            )}

            {!!title && (
              <Typography variant="h5" color="inherit">
                {title}
              </Typography>
            )}
          </Toolbar>
        </AppBar>
        {currentUser && (
          <SidebarDrawer
            drawerOpen={drawerOpen}
            handleToggleDrawer={this.handleToggleDrawer}
          />
        )}
        <MainContent hasSidebar={!!currentUser}>{children}</MainContent>
      </Wrapper>
    )
  }
}

export const PageLayout = compose<PageLayoutProps>(
  withRouter,
  withCurrentUser
)(C)
