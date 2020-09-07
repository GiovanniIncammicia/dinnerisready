import React, { useReducer, useMemo, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { reducer, initialState, Provider } from './context';
import Recipes from './components/Recipes';
import Calendar from './components/Calendar';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import PasswordReset from './components/Auth/PasswordReset';
import { Flex } from './components/Lib';
import { Loading } from './Icons';
import { auth, generateUserDocument } from './firebase';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, loading } = state;
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  useEffect(() => {
    auth.onAuthStateChanged(async user => {
      const data = await generateUserDocument(user);
      dispatch({ type: 'setUser', data });
    });
  }, [])

  return !user
    ? <NonLoggedRouter />
    : (
      <Provider value={contextValue}>
        { loading && <Overlay /> }
        <LoggedRouter />      
      </Provider>
    );
};

const Overlay = styled((props: any) => <Flex {...props}><Loading spin size="5x" /></Flex>)`
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100vw;
  background-color: black;
  opacity: 0.8;
  z-index: 100;
  color: var(--white);
  svg { animation: fa-spin 1s infinite linear; }
`;

const LoggedRouter = () => (
  <Switch>
    <Route path="/blog">blog</Route>
    <Route path="/calendar"><Calendar /></Route>
    <Route path="/"><Recipes /></Route>
  </Switch>
);

const NonLoggedRouter = () => (
  <Switch>
    <Route path="/signup"><Signup /></Route>
    <Route path="/password-reset"><PasswordReset /></Route>
    <Route path="/"><Signin /></Route>
  </Switch>
);