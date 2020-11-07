import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Header, Box, LinkBase, Tag, IconCoin, IconCirclePlus
} from '@aragon/ui';

import Comment from '../../components/Comment'

function ProtocolPage() {
  const history = useHistory();

  return (
    <>
      <Header primary="Protocol" />
      <Comment text="Advance Settings of opyn v2"/>
      <div style={{ padding: 5, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%', marginRight: '3%' }}>

          <MainButton
            title="Oracle"
            description="Submit Price / See oracl config"
            icon={<IconCoin size="large"/>}
            onClick={() => {
              history.push('/system/oracle/');
            }}
          />
        </div>

        <div style={{ width: '30%' }}>
          <MainButton
            title="Create"
            description="Create new options"
            icon={<IconCirclePlus size="large"/>}
            onClick={() => {
              history.push('/system/create/');
            }}
          />

        </div>
        <div style={{ width: '30%', marginLeft: '3%' }}>
          
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

export default ProtocolPage;
