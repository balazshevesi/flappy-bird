import {
  Actor,
  CollisionStartEvent,
  CollisionType,
  Color,
  Engine,
  SolverStrategy,
  vec,
} from "excalibur";

import { $score, resetScore, addPoint } from "./store/score";

//INIT ENGINE
const game = new Engine({
  viewport: {
    width: 1400,
    height: 800,
  },
  physics: {
    solver: SolverStrategy.Arcade,
    gravity: vec(0, 700),
  },
});

//BIRD
const bird = new Actor({
  width: 50,
  height: 50,
  color: Color.Yellow,
  pos: vec(game.halfDrawWidth - 25, game.halfDrawHeight),
  collisionType: CollisionType.Active,
});
game.add(bird);
const birdActions = {
  fly: () => (bird.vel.y = -400),
  reset: () => {
    bird.vel.y = 0;
    bird.pos = vec(game.halfDrawWidth - 25, game.halfDrawHeight);
  },
};

//PIPE
interface CreatePipe {
  gapPos: number;
}
const createPipe = ({ gapPos }: CreatePipe) => {
  gapPos = gapPos * 500;
  const upperPipe = new Actor({
    width: 50,
    height: 800,
    color: Color.Green,
    pos: vec(game.drawWidth + 50, 100 - gapPos),
    collisionType: CollisionType.Fixed,
  });
  const lowerPipe = new Actor({
    width: 50,
    height: 800,
    color: Color.Green,
    pos: vec(game.drawWidth + 50, 1100 - gapPos),
    collisionType: CollisionType.Fixed,
  });
  const ghostPipe = new Actor({
    width: 10,
    height: 150,
    color: Color.Rose,
    pos: vec(game.drawWidth + 50, 600 - gapPos),
    collisionType: CollisionType.Passive,
  });
  ghostPipe.on("precollision", () => {
    game.remove(ghostPipe);
    addPoint();
  });

  upperPipe.vel.x = -180;
  lowerPipe.vel.x = -180;
  ghostPipe.vel.x = -180;
  return [upperPipe, lowerPipe, ghostPipe];
};

const addPipe = () => {
  const pipe = createPipe({ gapPos: Math.random() });
  game.add(pipe[0]);
  game.add(pipe[1]);
  game.add(pipe[2]);
  return pipe;
};

//GROUND
const ground = new Actor({
  pos: vec(game.halfDrawWidth, game.drawHeight),
  width: game.drawWidth,
  height: 100,
  color: Color.DarkGray,
  collisionType: CollisionType.Fixed,
});
game.add(ground);

//CONTROLS
window.addEventListener("click", () => birdActions.fly());
window.addEventListener("keydown", (e) => e.key == " " && birdActions.fly());

//GAME LOGIC
$score.subscribe((state) => {
  console.log(state);
  const scoreElement = document.body.querySelector("#score");
  if (scoreElement) scoreElement.textContent = "" + state.value;
});

const pipes: Actor[][] = [];
const removePipes = () => {
  pipes.forEach((pipe) => {
    game.remove(pipe[0]);
    game.remove(pipe[1]);
    game.remove(pipe[2]);
  });
};
setInterval(() => {
  const pipe = addPipe();
  pipes.push(pipe);
  setTimeout(() => {
    game.remove(pipe[0]);
    game.remove(pipe[1]);
    game.remove(pipe[2]);
  }, 60000);
}, 2000);

bird.on("postcollision", () => {
  removePipes();
  resetScore();
  birdActions.reset();
});

//GAME START
game.start();
