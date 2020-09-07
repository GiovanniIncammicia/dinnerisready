import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Tooltip as ReachTooltip } from "@reach/tooltip";

type TFlex = {
  flexDirection?: 'row' | 'column',
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around',
  alignItems?: 'flex-start' | 'flex-end' | 'center',
  width?: string,
  height?: string,
  padding?: string,
  [key: string]: any
}

export const Flex = styled.div<TFlex>`
  display: flex;
  flex-direction: ${({ flexDirection = 'row' }) => flexDirection };
  justify-content: ${({ justifyContent = 'center' }) => justifyContent };
  align-items: ${({ alignItems = 'center' }) => alignItems };
  width: ${({ width }) => width ? width : 'auto'};
  height: ${({ height }) => height ? height : 'auto'};
  padding: ${({ padding }) => padding ? padding : '0'};
`;

export const IconButton = styled(({ icon, children, onClick } : { icon: ReactNode, children: ReactNode, onClick: () => void }) => (
  <button {...{ onClick }}>
    {icon}
    {children}
  </button>
))`& > svg:first-child { margin-right: 5rem; }`;

export const Tooltip = styled(ReachTooltip)`
  padding: 8rem 10rem;
  background-color: var(--text);
  color: var(--white);
  border: 0;
  border-radius: 5rem;
`;

export const Input = styled.input<{ width?: string, height?: string, [key: string]: any }>`
  border-bottom: 2rem solid var(--main);
  outline: none;
  background-color: var(--white);
  padding: 0 3rem;
  width: ${({ width }) => width ? width : 'auto'};
  height: ${({ height }) => height ? height : 'auto'};
`;