export enum GameField {
  X = 50,
  Y = 50,
  BOX = 10,
  ADDITION = 7,
}

export enum ControlKeys {
  LEFT = "ArrowLeft",
  UP = "ArrowUp",
  RIGHT = "ArrowRight",
  DOWN = "ArrowDown",
  ENTER = "Enter",
}

export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

export interface Food {
  x: number;
  y: number;
  drawFood: () => void;
  getNewFood: () => void;
}

export interface SnakeBox {
  x: number;
  y: number;
}
