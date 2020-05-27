const canvas = document.querySelector('#canv');
const ctx = canvas.getContext('2d');
let stepInterval;
const state = {
  game: false,
  direction: 'right',
  map: [],
  body: [[8, 5], [8, 4], [8, 3], [8, 2],],
};

function randomInteger(min, max) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
function gameOver() {
  console.log('GAME OVER'); clearInterval(stepInterval);
}
function food() {
  const map = state.map;
  const coord = [randomInteger(1, 17), randomInteger(1, 17)]
  if (map[coord[0]][coord[1]] == '') {
    map[coord[0]][coord[1]] = 'food'
  } else {
    food();
  }
}
function changeMapState() {
  const map = state.map;
  const body = state.body;

  body.forEach((item, index) => {
    if (index == 0) {
      map[item[0]][item[1]] = 'head';
    } else if (index == body.length - 1) {
      map[item[0]][item[1]] = 'tail';
    } else {
      map[item[0]][item[1]] = 'body';
    }
  });

}
function step() {
  const body = state.body;
  const map = state.map;
  const x = body[0][0];
  const y = body[0][1]
  console.log(x, y)
  switch (state.direction) {
    case 'right':
      if (state.direction !== 'left') {
        if (map[x][y + 1] === '' || map[x][y + 1] == 'food') {
          if (map[x][y + 1] == 'food') { body.push(body[body.length - 1]); food(); }
          body.unshift([x, y + 1]);
        } else { gameOver(); return null; }
      }
      break;
    case 'top':
      if (state.direction !== 'bottom') {
        if (map[x - 1][y] === '' || map[x - 1][y] == 'food') {
          if (map[x - 1][y] == 'food') { body.push(body[body.length - 1]); food(); }
          body.unshift([x - 1, y]);
        } else { gameOver(); return null; }
      }
      break;
    case 'bottom':
      if (state.direction !== 'top') {
        if (map[x + 1][y] === '' || map[x + 1][y] == 'food') {
          if (map[x + 1][y] == 'food') { body.push(body[body.length - 1]); food(); }
          body.unshift([x + 1, y]);
        } else { gameOver(); return null; }
      }
      break;
    case 'left':
      if (state.direction !== 'right') {
        if (map[x][y - 1] === '' || map[x][y - 1] == 'food') {
          if (map[x][y - 1] == 'food') { body.push(body[body.length - 1]); food(); }
          body.unshift([x, y - 1]);
        } else { gameOver(); return null; }
      }
      break;
    default:
      break;
  }

  const tail = body.pop();
  map[tail[0]][tail[1]] = '';
  changeMapState();
}
function render() {
  const map = state.map;
  for (let i = 0; i < map.length; i++) {
    for (let k = 0; k < map.length; k++) {
      if (k % 2 == 0) {
        i % 2 == 0 ? ctx.fillStyle = "#8ECC39" : ctx.fillStyle = "#A7D948"
      } else {
        i % 2 == 0 ? ctx.fillStyle = "#A7D948" : ctx.fillStyle = "#8ECC39"
      }

      if (state.map[i][k] == 'head') {
        ctx.fillStyle = '#000';
      } else if (state.map[i][k] == 'food') {
        ctx.fillStyle = 'red';
      } else if (state.map[i][k] == 'body' || state.map[i][k] == 'tail') {
        ctx.fillStyle = '#aaa';
      }
      ctx.fillRect(k * 30, i * 30, 30, 30);
    }
  }
}

function init() {
  const map = [];
  canvas.width = 510;
  canvas.height = 510;

  for (let i = 0; i < 17; i++) {
    map.push([]);
    for (let k = 0; k < 17; k++) {
      map[i].push('')
    }
  }
  state.map = map;
  changeMapState();
  render();
}
init();
document.addEventListener('keydown', (e) => {
  if (state.game === false) {
    food();
    stepInterval = setInterval(() => {
      state.game = true;
      step();
      render();
    }, 500)
  }
  switch (e.key) {
    case 'ArrowUp':
      if (state.direction !== 'bottom') { state.direction = 'top' }
      break;
    case 'ArrowDown':
      if (state.direction !== 'top') { state.direction = 'bottom' }
      break;
    case 'ArrowLeft':
      if (state.direction !== 'right') { state.direction = 'left' }
      break;
    case 'ArrowRight':
      if (state.direction !== 'left') { state.direction = 'right' }
      break;
    default:
      break;
  }
})