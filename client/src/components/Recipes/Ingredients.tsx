import React, { ChangeEvent, useState, memo } from 'react';
import { SliderInput, SliderTrack, SliderTrackHighlight, SliderHandle } from '@reach/slider';
import { IngredientsContainerStyled, IngredientStyled, IngredientsPlus, IngredientInput, IngredientSelect } from './styles';
import { TIngredient } from './reducer';
import { useHover, useLocalStorage } from '../../utility/hooks';
import { Trash, Plus, User } from '../../Icons';

enum EInput { qty = 'qty', unit = 'unit', names = 'names' };

export default function Ingredients ({ ingredients, serves, _id, handleChange }:
  { ingredients: TIngredient[], serves?: number, _id: string, handleChange: (name: string, value: string | number, ...props: any) => void }) {
  const emptyIngredient: TIngredient = { _id: `newIngredient_${ingredients.length}`, qty: "", ingredient: { unit: "", names: [] } };
  const [makeFor, setMakeFor] = useLocalStorage('makeFor', serves);
  const isNotNewRecipe = _id !== 'newRecipe';

  const calculateQty = (qty: string) =>
    (qty && !isNaN(Number(qty)) && qty.indexOf('.') !== qty.length - 1 && serves && makeFor && isNotNewRecipe)
      ? String(Math.round(Number(qty) / (serves / makeFor) * 10) / 10)
      : qty;
  const calculateValue = (value: string) =>
    (value && !isNaN(Number(value)) && value.indexOf('.') !== value.length - 1 && serves && makeFor && isNotNewRecipe)
      ? String(Number(value) * (serves / makeFor))
      : value;

  const onIngredientChange = (i: number) => (input: EInput, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleChange('ingredients', calculateValue(e.target.value), { input, i });
  const onIngredientDelete = (i: number) => () => handleChange('ingredients', "", { input: "delete", i });

  return (
    <IngredientsContainerStyled>
      {serves && isNotNewRecipe
      ? (<>
        <h3>Ingredients for:</h3>
        <SliderInput min={1} max={10} value={makeFor} onChange={setMakeFor}>
          <SliderTrack>
            <SliderTrackHighlight />
            <SliderHandle>{makeFor} <User fixedWidth={false} /></SliderHandle>
          </SliderTrack>
        </SliderInput>
      </>) : <h3>Ingredients</h3>
      }
      <div>
        {ingredients.concat(emptyIngredient).map(({ ingredient, qty, _id }, i) => (
          <Ingredient
            key={_id}
            qty={calculateQty(qty)}
            unit={ingredient.unit}
            name={ingredient.names[0]}
            onChange={onIngredientChange(i)}
            onDelete={onIngredientDelete(i)}
          />
        ))}
      </div>
    </IngredientsContainerStyled>
  );
}

const Ingredient = memo(({ qty = '', unit = '', name = '', onChange, onDelete }:{
  qty: string,
  unit: string,
  name: string,
  onChange: (input: EInput, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  onDelete: () => void
}) => {
  const [hoverRef, hovered] = useHover();
  const onQtyChange = (e: ChangeEvent<HTMLInputElement>) => onChange(EInput.qty, e);
  const onUnitChange = (e: ChangeEvent<HTMLSelectElement>) => onChange(EInput.unit, e);
  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => onChange(EInput.names, e);
  const [plusFocused, setPlusFocused] = useState(false);
  const renderInputs = (qty || name || unit) || plusFocused;
  const emptyInputs = !(qty || name || unit);
  const onFocus = () => setPlusFocused(true);
  const onBlur = () => emptyInputs && setPlusFocused(false);
  const stopPropagation = (e: FocusEvent) => e.stopPropagation();

  return (
    <IngredientStyled ref={hoverRef} tabIndex={!emptyInputs ? -1 : 0} {...{ onBlur, onFocus }}>
      { renderInputs
        ? (<>
          <IngredientInput autoFocus={emptyInputs} value={qty} onChange={onQtyChange} width="17%" placeholder="300" textAlign="right" onBlur={stopPropagation}/>
          <IngredientSelect value={unit} onChange={onUnitChange} width="24%" onBlur={stopPropagation}>
            <option value=""></option>
            <option value="g">g</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="cup">cup</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
            <option value="qb">qb</option>
          </IngredientSelect>
          <IngredientInput value={name} onChange={onNameChange} width="59%" placeholder="chicken breast" onBlur={stopPropagation}/>
          </>
        ) : <IngredientsPlus><Plus /></IngredientsPlus>
      }
      {hovered && !emptyInputs && <Trash onClick={onDelete} />}
    </IngredientStyled>
  );
});