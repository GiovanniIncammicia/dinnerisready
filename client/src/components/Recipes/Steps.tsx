import React, { ReactNode, ChangeEvent, memo, useMemo, useCallback, useLayoutEffect } from 'react';
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";

import { StepsStyled, StepsTitle, WorkstationIcons, WorkstationGrid, Flags, Info, NumberedIconStyled, FlagsSeparator, HR, MenuTitle, UInput, WSTextarea } from './styles';
import { TRecipe } from './reducer';
import { Flex, Tooltip } from '../Lib';
import { Chop, Prep, Cook, People, Fridge, Clock, Plus, Trash } from '../../Icons';
import { flagsEmojis, mealEmojis } from '../../utility/constants';
import { extractFlags, capitalize } from '../../utility/functions';
import { useHover, useImperativeSetFocus } from '../../utility/hooks';

type TGridStep = { text: string, _id: string };

export default function Steps ({ recipe, handleChange }: { recipe: TRecipe, handleChange: (name: string, value: string | number, ...props: any) => void }) {
  const gridSteps = useMemo(() => {
    enum wsMap { chop, prep, cook };
    let maxSlot = 0;
    const createEmptyGridStep = (slot: number) => [0, 1, 2].map(n => ({ text: '', _id: `emptyGridStep_${slot}_${n}` }));
    const onStepChange = (slot: number, ws: number, e: ChangeEvent<HTMLTextAreaElement>) => handleChange('steps', e.target.value, { slot, workstation: wsMap[ws] });
    return recipe.steps.reduce((acc: TGridStep[][], { workstation, text, slot, ...props }) => {
    if (!acc[slot]) acc[slot] = createEmptyGridStep(slot);
    acc[slot][wsMap[workstation as keyof typeof wsMap]] = { text, ...props };
    maxSlot = Math.max(maxSlot, slot);
    return acc;
  }, []).flat().concat(createEmptyGridStep(maxSlot + 1)).map((a, i) => ({
    ...a,
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => onStepChange(Math.floor(i / 3), i % 3, e),
  }))}, [recipe.steps, handleChange]);
  
  const toggleFlag = useCallback((value: string) => handleChange('flags', value), [handleChange]);
  const recipeFlags = useMemo(() => extractFlags(recipe.flags).map(flag => ({ flag, onClick: () => toggleFlag(flag) })), [recipe.flags, toggleFlag]);
  const notUsedFlags = useMemo(() => Object.keys(flagsEmojis).filter(k => !recipeFlags.some(({ flag }) => k === flag)), [recipeFlags]);
  const notUsedMeals = useMemo(() => Object.keys(mealEmojis).filter(k => k !== recipe.meal), [recipe.meal]);

  const changeMeal = useCallback((value: string) => handleChange('meal', value), [handleChange]);
  const onInfoChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => handleChange(name, e.target.value);
  const onTimeChange = onInfoChange('time');
  const onServesChange = onInfoChange('serves');
  const onLastChange = onInfoChange('last');
  const onNameChange = onInfoChange('name');
  
  const mealButton = useMemo(() => recipe.meal && <Meal meal={recipe.meal} />, [recipe.meal]);
  const flagButton = useMemo(() => <Plus />, []);

  const [nameRef, setNameFocus] = useImperativeSetFocus();

  useLayoutEffect(() => { (setNameFocus as () => void)() }, [setNameFocus, recipe._id]);
  
  return (
    <StepsStyled>
      <StepsTitle>
        <UInput ref={nameRef} value={recipe.name} onChange={onNameChange} width="auto" textAlign="center" placeholder="Write your recipe name"/>
      </StepsTitle>
      <Info>
        <Flags>
          { recipe.meal && <FlagMenu button={mealButton} meals={notUsedMeals} {...{ toggleFlag, changeMeal }}/>}
          { recipe.meal && recipeFlags.length > 0 && <FlagsSeparator />}
          { recipeFlags.map(f => <Flag key={`recipeFlags_${f.flag}`} {...f} />) }
          { (recipeFlags.length !== Object.keys(flagsEmojis).length || !recipe.meal) &&
            <FlagMenu button={flagButton} meals={notUsedMeals} flags={notUsedFlags} {...{ toggleFlag, changeMeal }}/>
          }
        </Flags>
        <Flex>
          <NumberedIcon value={recipe.time} unit="'" icon={<Clock fixedWidth={false} />} onChange={onTimeChange} />
          { (!recipe.serves || recipe._id === 'newRecipe') && <NumberedIcon value={recipe.serves} unit="" icon={<People fixedWidth={false} />} onChange={onServesChange} />}
          <NumberedIcon value={recipe.last} unit="d" icon={<Fridge fixedWidth={false} />} onChange={onLastChange} />
        </Flex>
      </Info>
      <WorkstationIcons>
        <Chop />
        <Prep />
        <Cook />
      </WorkstationIcons>
      <WorkstationGrid rows={Math.ceil(gridSteps.length / 3)}>
        { gridSteps.map(({ text: value, onChange }, i) => <WSTextarea key={`gridStepInput_${i}`} {...{ value, onChange }} placeholder="+" />) }
      </WorkstationGrid>
    </StepsStyled>
  );
};

const Flag = memo(({ flag, onClick }: { flag: string, onClick: (value: string) => void }) => {
  const [hoverRef, hovered] = useHover();
  return (
    <Tooltip label={capitalize(flag.toLowerCase())}>
      <span role="img" aria-label={flag} ref={hoverRef}>{hovered ? <Trash {...{ onClick }} /> : flagsEmojis[flag]}</span>
    </Tooltip>
  )
});

const Meal = memo(({ meal }: { meal: string}) => (
  <Tooltip label={capitalize(meal)}>
    <span role="img" aria-label="recipeMeal">{mealEmojis[meal]}</span>
  </Tooltip>
));

const NumberedIcon = ({ value = 0, unit, icon, onChange }: {
  value?: number,
  unit: string,
  icon: ReactNode,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) => (
  <NumberedIconStyled>
    <UInput {...{ value, onChange}} width="45rem" textAlign="right"/>
    {unit}
    {icon}
  </NumberedIconStyled>
);

const FlagMenu = memo(({ button, meals, flags = [], changeMeal, toggleFlag }:
  { button: ReactNode, meals: string[], flags?: string[], changeMeal: (value: string) => void, toggleFlag: (value: string) => void}) => (
  <Menu>
    <MenuButton>{button}</MenuButton>
    <MenuList>
      <MenuTitle>Meals</MenuTitle>
      { meals.map(e =>
        (<MenuItem onSelect={() => changeMeal(e)} key={`changeMealButton_${e}`}>
          {`${mealEmojis[e]} ${capitalize(e.toLowerCase())}`}
        </MenuItem>)
      )}
      { flags.length > 0 && (<>
        <HR />
        <MenuTitle>Flags</MenuTitle>
        { flags.map(e =>
          (<MenuItem onSelect={() => toggleFlag(e)} key={`toggleFlagButton_${e}`}>
            {`${flagsEmojis[e]} ${capitalize(e.toLowerCase())}`}
          </MenuItem>)
        )}
      </>)}
    </MenuList>
  </Menu>
));