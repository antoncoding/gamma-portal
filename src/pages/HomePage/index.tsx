import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Header, Box, LinkBase, Tag, IconSwap, IconUser, IconCirclePlus
} from '@aragon/ui';

import Comment from '../../components/Comment'

function HomePage() {
  const history = useHistory();

  return (
    <>
      <Header primary="Welcome to Opyn V2" />
      <Comment text="Tools for DeFi Risk Management."/>
      <div style={{ padding: 5, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%', marginRight: '3%' }}>

          <MainButton
            title="Account"
            description="Manage vaults, open / close positions"
            icon={<IconUser size="large"/>}
            onClick={() => {
              history.push('/account/');
            }}
          />
        </div>

        <div style={{ width: '30%' }}>
          <MainButton
            title="Trade"
            description="Coming Soon"
            icon={<IconSwap size="large"/>}
            onClick={() => {
              history.push('/trade/');
            }}
          />

        </div>
        <div style={{ width: '30%', marginLeft: '3%' }}>
          <MainButton
            title="Create"
            description="Create new options"
            icon={<IconCirclePlus size="large"/>}
            onClick={() => {
              history.push('/create/');
            }}
          />
        </div>
      </div>
    </>
  );
}

type MainButtonPropx = {
  title: string,
  description: string,
  icon: any,
  onClick: Function,
  tag?: string
}

function MainButton({
  title, description, icon, onClick, tag,
}: MainButtonPropx) {
  return (
    <LinkBase onClick={onClick} style={{ width: '100%', paddingBottom: 20 }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
          {tag ? <Tag>{tag}</Tag> : <></>}
        </div>
        {icon}
        <div style={{ paddingTop: 5, opacity: 0.5 }}>
          {' '}
          {description}
          {' '}
        </div>

      </Box>
    </LinkBase>
  );
}

export default HomePage;
