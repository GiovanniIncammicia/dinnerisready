import styled from 'styled-components';
import { Flex } from '../Lib';
import Dialog from '@reach/dialog';

export const CalendarDialog = styled(Dialog)<{ position: number }>`
  --margin: calc(var(--header-height) + 60rem); /* var(--day-header-height) */
  margin: var(--margin) 0 0 ${({ position }) => `calc(${position} * 100vw / 7)`};
  height: calc(100vh - var(--margin) - 20rem); /* CalendarGrid:last-of-type:padding-bottom */
  box-shadow: var(--shadow-2);
  width: calc(100vw / 7);
  border-radius: 7rem;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  & > h3 {
    text-align: center;
    padding: 10rem;
    user-select: none;
  }
  & > div:first-of-type {
    position: relative;
    input {
      width: 100%;
      padding: 10rem 32rem 10rem 10rem;
      font-size: 15rem;
      border: 1rem solid var(--border-gray);
      :focus {
        box-shadow: var(--shadow-1);
        border-color: var(--white);
        outline: none;
      }
    }
    svg {
      position: absolute;
      right: 10rem;
    }
  }
  & > div:last-child { overflow-y: auto; }
`; 

export const CalendarGrid = styled.div`
  --day-header-height: 60rem;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 1fr;
  :last-of-type { padding-bottom: 20rem; }
`;

export const WeekSelectorStyled = styled(Flex)`
  & > div {
    padding: 8rem;
    border-radius: 50%;
    font-size: 21rem;
    color: var(--white);
    border: 1.5rem solid var(--white);
    margin-right: 18rem;
    cursor: pointer;
    :hover {
      background-color: var(--white);
      color: var(--main);
    }
  }
  & > span {
    cursor: pointer;
    padding: 8rem 7rem;
    border-radius: 50%;
    margin-left: 5rem;
    :hover { background-color: var(--main-light); color: var(--main-dark) }
    .fa-chevron-left { right: 1rem; }
    .fa-chevron-right { left: 1rem; }
  }
  & > span > svg {
    position: relative;
    font-size: 20rem;
  }
  & > button {
    border: 1rem solid var(--white);
    border-radius: 7rem;
    padding: 10rem 20rem;
    margin: 0 40rem;
    :hover { background-color: var(--white); color: var(--main); }
  }
`;

export const DayHeaderStyled = styled(Flex)<{ today: boolean }>`
  flex-direction: column;
  height: var(--day-header-height);
  font-size: 18rem;
  user-select: none;
  span:last-child { font-size: 13rem; font-weight: 300; }

  ${({ today }) => today && `
    border-radius: 50rem;
    background-color: var(--main);
    height: calc(var(--day-header-height) - 13rem);
    margin: auto 20rem;
    color: white;
  `}
`;

export const CalendarDay = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - var(--header-height) - var(--day-header-height) - 20rem);
  width: 100%;
  border-right: 1rem solid var(--border-gray);
`;

export const CalendarCell = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  cursor: pointer;
  :hover, :focus {
    box-shadow: var(--shadow-1);
    border-radius: 5rem;
    outline: none;
  }
  & > svg {
    font-size: 25rem;
    color: var(--medium-gray);
  }
  & > div { width: 100%; padding: 10rem; }
  :hover {
    & > svg { color: var(--main) }
  }
`;

export const CalendarCellItem = styled(Flex)<{ dialog: boolean, generated: boolean }>`
  width: 100%;
  justify-content: space-between;
  position: relative;
  padding: ${({ dialog }) => !dialog ? '5rem 10rem' : 0};
  font-size: 14rem;
  border-radius: 5rem;
  margin-bottom: 5rem;
  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    opacity: 0;
    background-color: hsla(0, 79%, 45%, 0.92);
    border-radius: 5rem;
    padding: 5rem 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    svg { color: var(--white); font-size: 18rem }
    :hover { opacity: 1; }
  }
  ${({ generated }) => generated && `background-color: var(--main-superlight); border: 0.5rem solid var(--main);`}
`;

export const DialogRecipe = styled(Flex)<{ highlighted: boolean }>`
  justify-content: space-between;
  padding: 7rem;
  cursor: pointer;
  font-size: 15rem;
  border-bottom: 1rem solid var(--border-gray);
  outline: none;
  :hover { background-color: var(--background-gray); }
  ${({ highlighted }) => highlighted && `background-color: var(--main-superlight);`}
`;