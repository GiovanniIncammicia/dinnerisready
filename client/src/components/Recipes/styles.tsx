import styled from "styled-components";
import { Flex, Input } from "../Lib";
import noRecipeImg from '../../media/no-recipe.svg';

export const RecipesStyled = styled(Flex)`
  height: calc(100vh - var(--header-height));
  & > div { height: 100%; }
`;

export const NoRecipeStyled = styled.div`
  position: relative;
  flex-grow: 1;
  background-image: url(${noRecipeImg});
  background-size: cover;
  background-position: center;
  border-left: 1rem solid var(--border-gray);
  a {
    position: absolute;
    font-size: 18rem;
    right: 40rem;
    bottom: 20rem;
    color: white;
    text-shadow: var(--shadow-2);
    span {
      font-size: 23rem;
      display: inline-block;
      transform: rotate(-20deg);
      --bulb: hsl(33, 100%, 93.9%);
      text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px var(--bulb), 0 0 40px var(--bulb), 0 0 50px var(--bulb), 0 0 60px var(--bulb), 0 0 70px var(--bulb);
    }
  }
`;

export const ListStyled = styled(Flex)<{ open: boolean }>`
  width: ${({ open }) => open ? '17vw' : '0'};
  flex-basis: ${({ open }) => open ? '17vw' : '0'};
  visibility: ${({ open }) => open ? 'visible' : 'hidden'};
  transition: 0.1s;
  flex-direction: column;
  justify-content: flex-start;
  & > div { width: 100%; }
  & > div:first-child {
    padding: 20rem;
    button {
      display: ${({ open }) => open ? 'block' : 'none'};
      :hover{ color: var(--main); }
    }
    & > svg {
      margin-left: 15rem;
      font-size: 18rem;
      cursor: pointer;
      :hover { transform: scale(1.3); }
      visibility: visible;
      z-index:1;
    }
  }
`;

export const ListItemStyled = styled(Flex)<{ sel: boolean }>`
  justify-content: space-between;
  font-size: 15rem;
  cursor: pointer;
  padding: 10rem;
  position: relative;
  :not(:hover) { white-space: nowrap; }
  span {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  svg {
    :hover { color: var(--red) }
    position: absolute;
    right: 10rem;
  }
  ${({ sel }) => sel
    ? `
      background-color: var(--main-light);
      font-weight: 600;
    ` : `
      :nth-child(2n) { background-color: var(--background-gray); }
      :hover { background-color: var(--main-superlight); }
    `
  }
`;

export const SaveContainer = styled(Flex)`
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  font-size: 20rem;
  button:not(:last-child) { margin-bottom: 15rem; }
`;

export const StepsStyled = styled(Flex)`
  flex-grow: 1;
  flex-basis: 60vw;
  flex-direction: column;
  padding-top: 25rem;
  border-width: 0 1rem;
  border-color: var(--border-gray);
  border-style: solid;
  & > div:last-child { flex-grow: 1; }
`;

export const StepsTitle = styled.h1`
  font-size: 24rem;
  height: 32rem;
  font-weight: 600;
  input { padding-bottom: 3rem; }
`;

export const Info = styled(Flex)`
  width: 100%;
  padding: 0 20rem;
  justify-content: space-between;
  margin: 25rem 0 35rem;
`;

export const Flags = styled(Flex)`
  padding: 0 25rem;
  border-radius: 30rem;
  height: 53rem;
  user-select: none;
  background-color: var(--background-gray);
  span {
    font-size: 25rem;
    cursor: pointer;
    margin-right: 10rem;
    svg { color: var(--red);}
  }
  & > span:last-child { margin-right: 0 }
`;

export const MenuTitle = styled.p`
  text-align: center;
  font-weight: 600;
  font-size: 16rem;
  width: 100%;
  margin: 10rem 0;
`;

export const HR = styled.div`
  height: 1rem;
  background-color: var(--border-gray);
  width: 100%;
  margin-top: 10rem;
`;

export const FlagsSeparator = styled.div`
  background-color: var(--medium-gray);
  width: 1.5rem;
  height: 60%;
  margin-right: 10rem;
`;

export const UInput = styled.input<{ width?: string, textAlign?: string }>`
  text-align: ${({ textAlign }) => textAlign ? textAlign : 'left' };
  width: ${({ width }) => width ? width : 'auto' };
  margin-right: 2rem;
  padding-right: 4rem;
  background-color: var(--white);
  border-bottom: 1rem solid var(--text);
  :hover, :focus {
    border-color: var(--main);
    border-width: 2rem;
    outline: none;
  }
`;

export const NumberedIconStyled = styled.div`
  font-size: 20rem;
  :not(:last-of-type) { margin-right: 25rem }
  svg {
    font-size: 25rem;
    margin-left: 8rem;
  }
`;

export const WorkstationIcons = styled(Flex)`
  justify-content: space-around;
  width: 100%;
  align-items: flex-start;
  margin-bottom: 10rem;
  & > svg { font-size: 50rem; color: var(--main-dark)}
`;

export const WorkstationGrid = styled.div<{ rows: number }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(${({ rows }) => rows}, minmax(50rem, 1fr));
  width: 100%;
  overflow-y: auto;
`;

export const WSTextarea = styled.textarea`
  font-size: 15rem;
  text-align: center;
  outline: none;
  background-color: var(--white);
  padding: 5rem;
  resize: none;
  width: 100%;
  border-bottom: 0.5rem solid var(--border-gray);
  :not(:nth-child(3n)) { border-right: 0.5rem solid var(--border-gray); }
  :focus {
    border-bottom: 2rem solid var(--main);
    ::placeholder { color: transparent; }
  }
  ::placeholder {
    font-size: 25rem;
    font-weight: 300;
  }
`;

export const IngredientsContainerStyled = styled(Flex)`
  flex-basis: 23vw;
  flex-direction: column;
  padding: 17rem;
  line-height: 30rem;
  font-size: 18rem;
  h3 { text-align: center; }
  overflow: hidden;
  [data-reach-slider-input] { width: 100%; padding: 20rem 15rem;}
  [data-reach-slider-track-highlight] { background-color: var(--main-light) }
  [data-reach-slider-handle] {
    --slider-size: 26rem;
    --slider-border: 2rem;
    font-size: 15rem;
    border: var(--slider-border) solid var(--main-light);
    width: auto;
    padding: 0 5rem;
    height: var(--slider-size);
    border-radius: var(--slider-size);
    user-select: none;
    text-align: center;
    line-height: calc(var(--slider-size) - (var(--slider-border) * 2));
    white-space: nowrap;
  }
  & > div:last-child { margin-top: 15rem; overflow-y: scroll; }
`;

export const IngredientStyled = styled(Flex)`
  width: 100%;
  svg { cursor: pointer }
  & > svg:hover { color: var(--red) }
`;

export const IngredientsPlus = styled(Flex)`
  margin: 10rem auto 0;
  cursor: pointer;
  border-radius: 30rem;
  padding: 10rem 0;
  width: 100rem;
  :hover { background-color: var(--background-gray) }
`;

export const IngredientSelect = styled.select<{ width?: string, [key: string]: any }>`
  width: ${({ width }) => width ? width : 'auto'};
  background-color: var(--white);
  font-size: 14rem;
  height: 28rem;
  border-radius: 5rem;
  outline: none;
  :focus, :hover { border: 1.5rem solid var(--main); }
`;

export const IngredientInput = styled(Input)`
  font-size: 14rem;
  height: 28rem;
  text-align: ${({ textAlign = 'left'}) => textAlign };
  :not(:focus):not(:hover) { border-bottom: none; }
`;

export const SearchBarStyled = styled(Flex)`
  --sb-height: 45rem;
  --sb-left: 15rem;
  position: relative;
  color: black;
  & > svg {
    position: absolute;
    right: var(--sb-left);
    font-size: 18rem;
    line-height: var(--sb-height);
  }
  & > .fa-times { cursor: pointer; }
  & > input {
    border-radius: 20rem;
    height: var(--sb-height);
    width: 30vw;
    padding: 0 50rem 0 var(--sb-left);
    outline: none;
    background-color: var(--main-light);
    :focus, :hover { background-color: var(--white); }
    transition: background-color 0.5s ease;
  }
`;