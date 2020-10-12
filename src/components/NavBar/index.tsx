import React, { useCallback, useContext } from 'react';
import styled from 'styled-components'
import { walletContext } from '../../contexts/wallet'
import { useHistory } from 'react-router-dom';

import { Bar, BackButton, LinkBase, useToast } from '@aragon/ui';
import ConnectButton from './ConnectButton';

function MyBar() {
  const history = useHistory();
  const toast = useToast()
  const { user } = useContext(walletContext)

  const goBack = useCallback(() => {
    history.goBack();
  }, [history])

  return (
    <Bar
      primary={
        <>
          <MaxHeightDiv>
            <BackButton
              onClick={goBack}
            />
          </MaxHeightDiv>
          <LinkButton
            title="Create Options"
            onClick={() => {
              history.push('/create/');
            }}
          />
          <LinkButton
            title="My Account"
            onClick={() => {
              if (user === '') {
                toast('Please connect wallet')
              } else {
                history.push(`/account/${user}`);
              }

            }}
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
  opacity: ${ props => props.isSelected ? 1 : 0.5};
  font-size: 16px;
`

export default MyBar;
