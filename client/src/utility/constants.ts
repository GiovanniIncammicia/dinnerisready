type TFlags = { [key: string]: number };
export const flags: TFlags = {
  CARBS: 1,
  PROTEINS: 2,
  VEGGIES: 4,
  FREEZABLE: 8,
  QUICK: 16,
  PREPABLE: 32
};

type TEmojis = { [key: string]: string };
export const flagsEmojis: TEmojis = {
  CARBS: '🍞',
  PROTEINS: '🍖',
  VEGGIES: '🥦',
  FREEZABLE: '🧊',
  QUICK: '🥡',
  PREPABLE: '🔪',
};

export const mealEmojis: TEmojis = {
  main: '🍱',
  breakfast: '🍳',
  snack: '🥪'
}