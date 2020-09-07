import React, { memo, ReactNode } from 'react';
import { HeaderStyled, Logo, Menu, Icons } from './styles';
import { Flex } from '../Lib';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';

const Header = memo(({ children }: { children?: ReactNode }) => (
  <HeaderStyled>
    <Logo to="/">
      <span role="img" aria-label="Logo">🍙</span>
      <h1>DinnerIsReady</h1>
    </Logo>
    {children}
    <Flex>
      <Menu>
        <Link to="/">Blog</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/pantry">Pantry</Link>
        <Link to="/">Recipes</Link>
      </Menu>
      <Icons>
        <button onClick={() => auth.signOut()}>Sign out</button>
      </Icons>
    </Flex>
  </HeaderStyled>
));

export default Header;