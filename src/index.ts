import { ControlKeys, Direction, Food, GameField, SnakeBox } from "./types";
import {
  BG_COLOR,
  FIELD_COLOR,
  FONT,
  FOOD_COLOR,
  SNAKE_BODY_COLOR,
  SNAKE_HEAD_COLOR,
  TEXT_COLOR,
  TEXT_FOR_RESTART_GAME,
  TEXT_FOR_START_GAME,
} from "./constants";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let direction: Direction | null = null;
let score: number = 0;
let isGame: boolean = false;
let isDirectionChanged: boolean = false;
let game: NodeJS.Timeout;
let gameSpeed: number = 1;

const food: Food = {
  x: Math.floor(Math.random() * GameField.X) * GameField.BOX,
  y: Math.floor(Math.random() * GameField.Y) * GameField.BOX,
  drawFood: function (): void {
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(this.x, this.y, GameField.BOX, GameField.BOX);
  },
  getNewFood: function (): void {
    this.x = Math.floor(Math.random() * GameField.X) * GameField.BOX;
    this.y = Math.floor(Math.random() * GameField.Y) * GameField.BOX;
  },
};

let snake: SnakeBox[] = [
  {
    x: (GameField.X / 2 - 1) * GameField.BOX,
    y: (GameField.Y / 2 - 1) * GameField.BOX,
  },
];

function drawGameField(): void {
  for (let x = 0; x < GameField.X; ++x) {
    for (let y = 0; y < GameField.Y + GameField.ADDITION; ++y) {
      ctx.fillStyle = y < GameField.Y ? FIELD_COLOR : BG_COLOR;
      ctx.fillRect(
        GameField.BOX * x,
        GameField.BOX * y,
        GameField.BOX,
        GameField.BOX
      );
    }
  }
}

function drawSnake(): void {
  snake.forEach((el, index) => {
    ctx.fillStyle = index === 0 ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
    ctx.fillRect(el.x, el.y, GameField.BOX, GameField.BOX);
  });
}

function eatFood(snakeHead: SnakeBox): void {
  if (isEatten(food, snakeHead)) {
    score++;
    gameSpeed++;
    snake.push(snakeHead);
    food.getNewFood();
    startGame();
  }
}
function crashIntoAWall(snakeHead: SnakeBox): void {
  if (
    snakeHead.x > (GameField.X - 1) * GameField.BOX ||
    snakeHead.y > (GameField.Y - 1) * GameField.BOX ||
    snakeHead.x < 0 ||
    snakeHead.y < 0
  ) {
    endGame();
  }
}
function biteTail(snakeHead: SnakeBox): void {
  const isBite = snake.find(
    (el, index) => index > 0 && isEatten(el, snakeHead)
  );
  if (isBite) {
    endGame();
  }
}

function isEatten(el: SnakeBox, snakeHead: SnakeBox): boolean {
  return el.x === snakeHead.x && el.y === snakeHead.y;
}

ctx.fillStyle = SNAKE_HEAD_COLOR;
ctx.fillRect(snake[0].x, snake[0].y, GameField.BOX, GameField.BOX);

function handlerKeydown(event: DocumentEventMap["keydown"]) {
  if (event.key === ControlKeys.ENTER && isGame === false) {
    restartGame();
  }

  if (isDirectionChanged) {
    return;
  }

  if (event.key === ControlKeys.DOWN && direction !== Direction.UP && isGame) {
    direction = Direction.DOWN;
    isDirectionChanged = true;
  }
  if (event.key === ControlKeys.UP && direction !== Direction.DOWN && isGame) {
    direction = Direction.UP;
    isDirectionChanged = true;
  }
  if (
    event.key === ControlKeys.LEFT &&
    direction !== Direction.RIGHT &&
    isGame
  ) {
    direction = Direction.LEFT;
    isDirectionChanged = true;
  }
  if (
    event.key === ControlKeys.RIGHT &&
    direction !== Direction.LEFT &&
    isGame
  ) {
    direction = Direction.RIGHT;
    isDirectionChanged = true;
  }
}

function endGame(): void {
  clearInterval(game);
  isGame = false;
  direction = null;
  drawAdditionText(TEXT_FOR_RESTART_GAME);
}

function drawAdditionText(text: string): void {
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = FONT;
  ctx.fillText(text, GameField.BOX, GameField.BOX * (GameField.Y + 6));
}

function drawScore(): void {
  const text = `Score - ${score}`;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = FONT;
  ctx.fillText(text, GameField.BOX, GameField.BOX * (GameField.Y + 2.5));
}

function drawGameFrame(): void {
  drawGameField();
  food.drawFood();
  drawScore();
  drawSnake();
  if (!direction) {
    drawAdditionText(TEXT_FOR_START_GAME);
  }

  const snakeHead: SnakeBox = {
    x: snake[0].x,
    y: snake[0].y,
  };

  eatFood(snakeHead);

  if (direction === Direction.DOWN) snakeHead.y += GameField.BOX;
  if (direction === Direction.UP) snakeHead.y -= GameField.BOX;
  if (direction === Direction.LEFT) snakeHead.x -= GameField.BOX;
  if (direction === Direction.RIGHT) snakeHead.x += GameField.BOX;
  isDirectionChanged = false;

  crashIntoAWall(snakeHead);

  snake.pop();

  biteTail(snakeHead);

  snake.unshift(snakeHead);
}

function startGame(): void {
  if (isGame) {
    clearInterval(game);
  }
  const speed = 200 - gameSpeed * (10 - gameSpeed * 0.1);
  game = setInterval(drawGameFrame, speed);
}

function restartGame(): void {
  food.getNewFood();
  score = 0;
  snake = [
    {
      x: (GameField.X / 2 - 1) * GameField.BOX,
      y: (GameField.Y / 2 - 1) * GameField.BOX,
    },
  ];
  isGame = true;
  gameSpeed = 1;
  startGame();
}

document.addEventListener("keydown", handlerKeydown);

isGame = true;
startGame();
