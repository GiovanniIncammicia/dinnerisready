import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeaderStyled = styled.header`
  height: var(--header-height);
  background-color: var(--main);
  box-shadow: var(--shadow-2);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 300;
  padding: 0 var(--lateral-padding);
  position: sticky;
  top: 0;
  & > div { height: 100%; }
`;

export const Logo = styled(Link)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: var(--lateral-padding);
  font-size: 35rem;
  & > h1 { margin-left: 17rem; font-size: 22rem; line-height: 22rem; font-weight: 400; }
  :hover { text-decoration: none; }
`;

export const Menu = styled.nav`
  & > a { padding: 0 10rem; }
  & > a:not(:last-child) { border-right: 1rem solid white; }
`;

export const Icons = styled.div`
  margin-left: 20rem;
  svg { font-size: 25rem; cursor: pointer; }
`;