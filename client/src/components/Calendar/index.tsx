import React, { useEffect, useReducer, ChangeEvent, useMemo, MouseEvent, useCallback } from 'react';
import { CalendarGrid, CalendarDay, CalendarCell, DayHeaderStyled, CalendarDialog, DialogRecipe, CalendarCellItem, WeekSelectorStyled } from './styles';
import { Plus, Search, Trash, ChevronLeft, ChevronRight, Magic } from '../../Icons';
import { listRecipes, createEvent, listEvents, deleteEvent, createEvents } from '../../utility/api';
import { useGlobalContext } from '../../context';
import { TRecipe } from '../Recipes/reducer';
import { Flex, Tooltip } from '../Lib';
import { TEvent, reducer, initialState } from './reducer';
import { flags, flagsEmojis } from '../../utility/constants';
import { formatDate, compareDates, generateMealPlan } from '../../utility/functions';
import Header from '../Header';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS: { [key: string]: string } = {'01':'January','02':'February','03':'March','04':'April','05':'May','06':'June','07':'July','08':'August','09':'September','10':'October','11':'November','12':'December'};
const isGeneratedEvent = (_id: string) => _id.slice(0, 16) === 'generateMealPlan';

const Calendar = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { events, recipes, isOpen, position, slot, search, highlighted, selectedWeek, toConfirm } = state;
  const [{ user }, globalDispatch] = useGlobalContext();

  const week = useMemo((day = new Date()) => {
    day.setDate(day.getDate() + (7 * selectedWeek));
    return [1,2,3,4,5,6,7].map(i => formatDate(new Date(day.setDate(day.getDate() - day.getDay() + i))));
  }, [selectedWeek]);

  const fetchEvents = useCallback(async () => {
    if (week.length === 7) {
      globalDispatch({ type: 'toggleLoading' });
      const list = await listEvents(user.uid, week[0], week[6]);
      if (!(list instanceof Error))  {
        const data: {[key: string]: TEvent[]} = {};
        list.forEach((d: TEvent) => {
          const date = d.date.slice(0, 10);
          if (!data[date]) data[date] = [d];
          else data[date].push(d);
        });
        dispatch({ type: 'loadEvents', data });
      }
      globalDispatch({ type: 'toggleLoading' });
    }
  }, [globalDispatch, user.uid, week]);

  const onDismiss = () => dispatch({ type: 'close' });
  const onClick = (value: number, slot: number) => dispatch({ type: 'open', value, slot });
  const onChange = (e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'search', value: e.target.value });
  const handlePreviousWeek = () => dispatch({ type: 'previousWeek' });
  const handleNextWeek = () => dispatch({ type: 'nextWeek' });
  const handleToday = () => dispatch({ type: 'today' });

  // First it filters out the already added recipes
  // then it filters by the search input value
  const filteredRecipes = useMemo(() => recipes.filter(r =>
    !events[week[position]]?.some(e => e.slot === slot && (e.recipe as TRecipe)._id === r._id )
    && r.name.toLowerCase().includes(search.toLowerCase())
  ), [search, recipes, position, slot, events, week]);

  const isHighlighted = (i: number) => highlighted >= filteredRecipes.length ? (i === 0) : (i === highlighted);

  const onClickRecipe = async (i: number) => {
    await createEvent({ recipe: filteredRecipes[i]._id, date: week[position], slot, user: user.uid });
    onDismiss();
    fetchEvents();
  };

  const onDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    fetchEvents();
  }

  const onCalendarEnter = (e: any, i: number, slot: number) => (e.key === 'Enter') && onClick(i, slot);

  const onKeyDown = (e: any) => {
    if(e.key === 'ArrowDown') dispatch({ type: 'highlight', value: Math.min(highlighted + 1, recipes.length - 1) });
    else if (e.key === 'ArrowUp') dispatch({ type: 'highlight', value: Math.max(highlighted - 1, 0) });
    else if (e.key === 'Enter' && filteredRecipes[highlighted]) onClickRecipe(highlighted);
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await listRecipes(user.uid);
      if (!(data instanceof Error)) dispatch({ type: 'loadRecipes', data });
    }
    fetchRecipes();
  }, [globalDispatch, user.uid]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const makeMealPlan = () => {
    const plan = generateMealPlan(events, week, recipes, user.uid);
    const data = week.reduce((acc, date) => ({
      ...acc,
      [date]: [...(events[date] || []), ...plan[date]]
    }), {});
    dispatch({ type: 'loadEvents', data });
    dispatch({ type: 'setToConfirm', value: true });

  }

  const onConfirm = async () => {
    const data = Object.values(events)
    .reduce((acc, arr) => [...acc, ...arr.filter(({ _id }) => isGeneratedEvent(_id))], [])
    .map(({ _id, ...event }) => event);

    await createEvents(data);
    fetchEvents();
    dispatch({ type: 'setToConfirm', value: false });
  }
  return (<>
    <Header>
      {!toConfirm 
        ? <WeekSelector {...{ makeMealPlan, handlePreviousWeek, handleNextWeek, handleToday }} />
        : <button onClick={onConfirm}>Confirm meal plan</button>
      }
    </Header>
    <CalendarGrid>
      {DAYS.map((d, i) => <DayHeader key={`day_header_${d}`} day={d} month={week[i].slice(5,7)} date={week[i].slice(8,10)} year={week[i].slice(0,4)} />)}
    </CalendarGrid>
    <CalendarGrid>
      {DAYS.map((d, i) => <Day key={`day_${d}`} day={d} recipes={events[week[i]]} onDelete={onDeleteEvent} onClick={(slot: number) => onClick(i, slot)} onKeyDown={(e: any, slot: number) => onCalendarEnter(e, i, slot)} />)}
    </CalendarGrid>
    <CalendarDialog {...{ isOpen, onDismiss, position }} aria-label="Add a recipe to a day">
      <h3>Select a recipe</h3>
      <Flex>
        <input value={search} {...{ onChange, onKeyDown }} />
        <Search />
      </Flex>
      <div>
        {filteredRecipes.map((r, i) => <Recipe key={r._id} highlighted={isHighlighted(i)} onClick={() => onClickRecipe(i)} {...{ r }} />)}
      </div>
    </CalendarDialog>
  </>);
};

const WeekSelector = ({ makeMealPlan, handlePreviousWeek, handleNextWeek, handleToday }:
  { makeMealPlan: () => void, handlePreviousWeek: () => void, handleNextWeek: () => void, handleToday: () => void
}) => (
  <WeekSelectorStyled>
    <div onClick={makeMealPlan}><Magic /></div>
    <button onClick={handleToday}>Today</button>
    <Tooltip label="Previous Week"><span onClick={handlePreviousWeek}><ChevronLeft /></span></Tooltip>
    <Tooltip label="Next Week"><span onClick={handleNextWeek}><ChevronRight /></span></Tooltip>
  </WeekSelectorStyled>
);

const DayHeader = ({ day, month, date, year }: { day: string, month: string, date: string, year: string }) => (
  <DayHeaderStyled today={compareDates(date, month, year)}>
    <span>{day}</span>
    <span>{MONTHS[month]} {date}</span>
  </DayHeaderStyled>
);

type TDayCellParameters = { onDelete: (id: string) => void; onClick: (slot: number) => void, onKeyDown: (e: any, slot: number) => void };

const Day = (props: TDayCellParameters & { recipes: TEvent[], day: string }) => {
  const { recipes, day, ...rest } = props;
  const dayRecipes: any = useMemo(() => (recipes || []).reduce((acc: { [key: string]: TEvent[] }, r: TEvent) => ({
    ...acc,
    [r.slot]: acc[r.slot] ? [...acc[r.slot], r] : [r] 
  }), {}), [recipes]);
  return (
    <CalendarDay>
      {[...Array(3)].map((_,i) => <Cell key={`day_${day}_daycell_${i}`} {...rest} slot={i} recipes={dayRecipes[i]}/>)}
    </CalendarDay>
  );
};


const Cell = ({ recipes, onDelete, onClick, onKeyDown, slot }: TDayCellParameters & { recipes: TEvent[], slot: number }) => (
  <CalendarCell tabIndex={0} onClick={() => (!recipes || recipes.length < 3) && onClick(slot)} onKeyDown={(e: any) => onKeyDown(e, slot)}>
    { recipes && (
      <Flex flexDirection="column">
        { recipes.map(r => <CellItem key={`cell_${r._id}`} r={r.recipe as TRecipe} onDelete={() => onDelete(r._id)} generated={isGeneratedEvent(r._id)} />) }
      </Flex>
    )}
    { (!recipes || recipes.length < 3) && <Plus /> }
  </CalendarCell>
);

const CellItem = ({ r, dialog = false, onDelete, generated }: { r: TRecipe, dialog?: boolean, onDelete?: () => void, generated: boolean }) => {
  const carbs = r.flags & flags.CARBS;
  const proteins = r.flags & flags.PROTEINS;
  const veggies = r.flags & flags.VEGGIES;
  const onDeleteClick = (e: MouseEvent) => { e.stopPropagation(); onDelete?.(); }
  return (
    <CalendarCellItem {...{ dialog, generated }}>
      {r.name}
      <Flex>
        { carbs ? flagsEmojis.CARBS : null }
        { proteins ? flagsEmojis.PROTEINS : null }
        { veggies ? flagsEmojis.VEGGIES : null }
      </Flex>
      { !dialog && <span onClick={onDeleteClick}><Trash /></span>}
    </CalendarCellItem>
  )
};

const Recipe = ({ r, highlighted, onClick }: { r: TRecipe, highlighted: boolean, onClick: () => void }) => (
  <DialogRecipe {...{ highlighted, onClick }}>
    <CellItem {...{ r }} dialog={true} generated={false} />
  </DialogRecipe>
);

export default Calendar;