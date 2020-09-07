import React, { useReducer, useCallback, useEffect, ChangeEvent, useRef, useLayoutEffect, forwardRef, Ref } from 'react';
import { RecipesStyled, NoRecipeStyled, SearchBarStyled } from './styles';
import List from './List';
import Steps from './Steps';
import Ingredients from './Ingredients';
import { reducer, initialState, TRecipe } from './reducer';
import { listRecipes } from '../../utility/api';
import { useGlobalContext } from '../../context';
import Header from '../Header';
import { Search, Times } from '../../Icons';
import { useImperativeSetFocus } from '../../utility/hooks';

export default function Recipes () {
  const [{ user }, globalDispatch] = useGlobalContext();
  const [{ search, ...state}, dispatch] = useReducer(reducer, initialState);
  const recipe = state.recipes[state.selected];
  const initialRecipes = useRef<TRecipe[]>([]);
  const handleClick = useCallback((index: number) => dispatch({ type: 'select', index }), [dispatch]);
  const handleSave = (data: TRecipe) => dispatch({ type: 'save', index: state.selected, data });
  const handleDelete = (index: number) => dispatch({ type: 'delete', index });
  const handleCreate = () => dispatch({ type: 'create', value: user.uid });
  const handleReset = (recipes: TRecipe[]) => dispatch({ type: 'load', data: { recipes }});
  const handleChange = useCallback((name: string, value: string | number, rest: any) => dispatch({ type: 'change', index: state.selected, name, value, ...rest }), [dispatch, state.selected]);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'search', data: { recipes: initialRecipes.current }, value: e.target.value });
  const handleSearchReset = () => handleSearch({ target: { value: ''}} as ChangeEvent<HTMLInputElement>);

  useEffect(() => {
    const fetchData = async () => {
      globalDispatch({ type: 'toggleLoading' });
      const recipes = await listRecipes(user.uid);
      if (Array.isArray(recipes) && recipes.length > 0) {
        initialRecipes.current = recipes;
        dispatch({ type: 'load', data: { recipes } });
      }
      globalDispatch({ type: 'toggleLoading' });
    };
    fetchData();
  }, [globalDispatch, user.uid]);

  const [nameRef, setNameFocus] = useImperativeSetFocus();

  useLayoutEffect(() => { (setNameFocus as () => void)() }, [setNameFocus, search]);

  return (<>
    <Header>
      <SearchBar ref={nameRef} value={search} onChange={handleSearch} onReset={handleSearchReset} />
    </Header>
    <RecipesStyled>
      <List {...{ ...state, handleClick, handleSave, handleDelete, handleCreate, handleReset }} />
      { recipe
        ? (
          <>
            <Steps {...{ recipe, handleChange }} />
            <Ingredients {...{ handleChange }} {...(({ ingredients, serves, _id }) => ({ ingredients, serves, _id }))(recipe)} />
          </>
        ) : <NoRecipe />
      }
    </RecipesStyled>
  </>);
}

const NoRecipe = () => (
  <NoRecipeStyled>
    <a href="#"><span role="img" aria-label="Bulb icon">💡</span> Looking for inspiration?</a>
  </NoRecipeStyled>
);

const SearchBar = forwardRef((
  { value, onChange, onReset }: { ref: any, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, onReset: () => void },
  ref: Ref<HTMLInputElement>
) => (
  <SearchBarStyled>
    <input {...{ ref, value, onChange }} />
    { value ? <Times onClick={onReset} /> : <Search /> }
  </SearchBarStyled>
));