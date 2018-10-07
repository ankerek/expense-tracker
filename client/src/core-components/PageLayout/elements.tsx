import * as React from "react";
import styled from "styled-components";
import { AppBarProps } from "@material-ui/core/AppBar";
import MUAppBar from "@material-ui/core/AppBar/AppBar";
import { DRAWER_WIDTH } from "@core-components/SidebarDrawer";

export const Wrapper = styled.div`
  display: flex;
`

export const AppBar = styled<{ drawerOpen: boolean } & AppBarProps>(
  ({ drawerOpen, ...rest }) => <MUAppBar {...rest} />
)`
  && {
    z-index: 1300;
    margin-left: ${props => (props.drawerOpen ? DRAWER_WIDTH : 0)};
    width: ${props =>
  props.drawerOpen ? `calc(100% - ${DRAWER_WIDTH})` : '100%'};
  }
`

export const MainContent = styled.main`
  height: 100vh;
  flex-grow: 1;
  padding: 80px 20px 0 20px;
  overflow: auto;
`
