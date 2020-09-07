import React, { memo } from 'react';
import { ListStyled, ListItemStyled, SaveContainer } from './styles';
import { Flex, IconButton } from '../Lib';
import { ChevronLeft, ChevronRight, Plus, Save, Undo, Trash } from '../../Icons';
import { useLocalStorage, useHover } from '../../utility/hooks';
import { TRecipe } from './reducer';
import { useGlobalContext } from '../../context';
import { createRecipe, listRecipes, deleteRecipe, updateRecipe } from '../../utility/api';

export default function List ({ recipes, selected, modified, handleClick, handleSave, handleDelete, handleCreate, handleReset }:{
  recipes: TRecipe[],
  selected: number,
  modified: boolean,
  handleClick: (index: number) => void,
  handleSave: (data: TRecipe) => void,
  handleDelete: (i: number) => void,
  handleCreate: () => void,
  handleReset: (recipes: TRecipe[]) => void
}) {
  const [open, setOpen] = useLocalStorage('recipeListIsOpen', true);
  const [{ user }, dispatch] = useGlobalContext();
  const toggleOpen = () => setOpen((o: boolean) => !o);
  
  const performSideTransition = async (transition: () => any, cb: (data: any) => any) => {
    const toggleLoading = () => dispatch({ type: 'toggleLoading' });
    toggleLoading();
    const data = await transition();
    if (!(data instanceof Error)) {
      cb(data);
      // TODO: fai comparire toast notification (custom con reach/alert)
    }
    toggleLoading();
  };

  const onSave = () => performSideTransition(() => recipes[selected]._id === 'newRecipe'
    ? createRecipe(recipes[selected])
    : updateRecipe(recipes[selected])
  , handleSave);
  const onDelete = (i: number) => performSideTransition(() => deleteRecipe(recipes[i]._id), () => handleDelete(i));
  const onCancel = () => performSideTransition(() => listRecipes(user.uid), handleReset);

  return (
    <ListStyled open={open || modified}>
      {
        modified
        ? (
          <SaveContainer>
            <IconButton icon={<Save />} onClick={onSave}>SAVE CHANGES</IconButton>
            <IconButton icon={<Undo />} onClick={onCancel}>CANCEL</IconButton>
          </SaveContainer>)
        : (<>
          <Flex justifyContent="space-between">
            <IconButton icon={<Plus />} onClick={handleCreate}>Add Recipe</IconButton>
            { open
              ? <ChevronLeft onClick={toggleOpen} />
              : <ChevronRight onClick={toggleOpen} />
            }
          </Flex>
          { recipes.map((d: any, i: any) => <ListItem key={d._id} name={d.name} sel={selected === i} {...{ i, handleClick, onDelete }}></ListItem>)}
        </>)
      }
    </ListStyled>
  );
};

const ListItem = memo(({ name, sel, i, handleClick, onDelete }: {
  name: string,
  sel: boolean,
  i: number,
  handleClick: (index: number) => void,
  onDelete: (index: number) => void
}) => {
  const onClick = () => handleClick(i);
  const onDeleteClick = (e: MouseEvent) => { e.stopPropagation(); onDelete(i) };
  const [hoverRef, hovered] = useHover();
  return (
    <ListItemStyled { ...{ sel, onClick } } ref={hoverRef}>
      <span>{name}</span>
      {hovered && <Trash onClick={onDeleteClick} />}
    </ListItemStyled>
  );
});