import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components'
import { useHistory } from 'react-router-dom';

import {
  Bar, BackButton, LinkBase,
} from '@aragon/ui';
import ConnectButton from './ConnectButton';

function MyBar() {
  const history = useHistory();
  const [isHome, updateIsHome] = useState(true);

  const goBack = useCallback(()=>{
    history.goBack();
  }, [history])

  useEffect(() => {
    const home = history.location.pathname === '/';
    updateIsHome(home);
  }, [history.location.pathname]);
  return (
    <Bar
      primary={
        !isHome &&
          <>
            <MaxHeightDiv>
              <BackButton
                onClick={goBack}
              />
            </MaxHeightDiv>
            <LinkButton
              title="Home"
              onClick={() => {
                history.push('/');
              }}
              isSelected={history.location.pathname === '/'}
            />
            <LinkButton
              title="Create Options"
              onClick={() => {
                history.push('/create/');
              }}
              isSelected={history.location.pathname === '/create/'}
            />
            <LinkButton
              title="Operators"
              onClick={() => {
                history.push('/operators/');
              }}
              isSelected={history.location.pathname === '/operators/'}
            />
          </>
        
      }
      secondary={
        <>
          <ConnectButton />
          {/* <ChangeModeButton/> */}
        </>
      }
    />

  );
}


type linkButtonProps = {
  title: string,
  onClick: Function,
  isSelected?: boolean
}

function LinkButton({ title, onClick, isSelected = false }: linkButtonProps) {
  return (
    <div style={{ paddingLeft: 40 }}>
      <LinkBase onClick={onClick}>
        <Link isSelected={isSelected}> {title} </Link>
      </LinkBase>
    </div>
  );
}

const MaxHeightDiv = styled.div`
  height: 100%;
`

const Link = styled.div`
  padding: '1%';
  opacity: ${ props => props.isSelected ? 1 : 0.5 };
  font-size: 16px;
`

export default MyBar;
