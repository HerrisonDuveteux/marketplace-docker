// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props, ThemeDef, ThemeProps } from '@polkadot/react-components/types';

import React, { useContext, useEffect, useMemo } from 'react';
import store from 'store';
import styled, { ThemeContext } from 'styled-components';

import AccountSidebar from '@polkadot/app-accounts/Sidebar';
import { getSystemChainColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';
import uiSettings from '@polkadot/ui-settings';

import ConnectingOverlay from './overlays/Connecting';
import Content from './Content';
import defaultNftTypes from './defaultNftTypes';
import Menu from './Menu';
import WarmUp from './WarmUp';

export const PORTAL_ID = 'portals';

function Apps ({ className = '' }: Props): React.ReactElement<Props> {
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const { api, systemChain, systemName } = useApi();

  const uiHighlight = useMemo(
    () => getSystemChainColor(systemChain, systemName),
    [systemChain, systemName]
  );

  // set default nft types and substrate prefix
  useEffect(() => {
    try {
      const types: Record<string, any> = JSON.parse(defaultNftTypes) as Record<string, any>;

      api.registerTypes(types);
      store.set('types', types);
      const settings = { ...uiSettings.get(), prefix: 42 };

      uiSettings.set(settings);
    } catch (error) {
      console.error(error);
    }
  }, [api]);

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <div className={`apps--Wrapper theme--${theme} ${className}`}>
        <Menu />
        <AccountSidebar>
          <Signer>
            <Content />
          </Signer>
          <ConnectingOverlay />
          <div id={PORTAL_ID} />
        </AccountSidebar>
      </div>
      <WarmUp />
    </>
  );
}

export default React.memo(styled(Apps)(({ theme }: ThemeProps) => `
  background: ${theme.bgPage};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`));