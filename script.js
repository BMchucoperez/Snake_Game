// Definimos los elementos HTML necesarios para el juego
const board = document.getElementById('game-board'); // El área de juego donde se dibujarán la serpiente y la comida
const instructionText = document.getElementById('instruction-text'); // Texto de instrucciones al inicio del juego
const logo = document.getElementById('logo'); // El logotipo del juego, que se oculta al iniciar el juego
const score = document.getElementById('score'); // Elemento donde se muestra la puntuación actual
const highScoreText = document.getElementById('highScore'); // Elemento donde se muestra la puntuación más alta alcanzada

// Definimos las variables del juego
const gridSize = 20; // Tamaño de la cuadrícula del juego (20x20)
let snake = [{ x: 10, y: 10 }]; // La serpiente empieza en el centro de la cuadrícula
let food = generateFood(); // Genera la comida en una posición aleatoria
let highScore = 0; // La puntuación más alta registrada
let direction = 'right'; // Dirección inicial de la serpiente
let gameInterval; // Intervalo de tiempo para actualizar el juego
let gameSpeedDelay = 200; // Velocidad inicial del juego en milisegundos
let gameStarted = false; // Indica si el juego ha comenzado

// Función principal para dibujar el mapa del juego, la serpiente y la comida
function draw() {
  board.innerHTML = ''; // Limpia el contenido del tablero
  drawSnake(); // Dibuja la serpiente en el tablero
  drawFood(); // Dibuja la comida en el tablero
  updateScore(); // Actualiza la puntuación en la pantalla
}

// Dibujamos la serpiente en el tablero
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake'); // Crea un nuevo elemento para cada segmento de la serpiente
    setPosition(snakeElement, segment); // Establece la posición del segmento en la cuadrícula
    board.appendChild(snakeElement); // Añade el segmento al tablero
  });
}

// Creamos un nuevo elemento (div) con una clase específica
function createGameElement(tag, className) {
  const element = document.createElement(tag); // Crea un nuevo elemento HTML
  element.className = className; // Asigna una clase al elemento
  return element; // Devuelve el elemento creado
}

// Establecemos la posición de un elemento en la cuadrícula usando coordenadas
function setPosition(element, position) {
  element.style.gridColumn = position.x; // Establece la columna en la cuadrícula
  element.style.gridRow = position.y; // Establece la fila en la cuadrícula
}

// Función para dibujar la comida en el tablero
function drawFood() {
  if (gameStarted) { // Asegura que la comida solo se dibuje cuando el juego haya comenzado
    const foodElement = createGameElement('div', 'food'); // Crea un nuevo elemento para la comida
    setPosition(foodElement, food); // Establece la posición de la comida en la cuadrícula
    board.appendChild(foodElement); // Añade la comida al tablero
  }
}

// Generamos una nueva posición aleatoria para la comida
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1; // Genera una coordenada x aleatoria
  const y = Math.floor(Math.random() * gridSize) + 1; // Genera una coordenada y aleatoria
  return { x, y }; // Devuelve un objeto con las coordenadas de la comida
}

// Función para mover la serpiente según la dirección actual
function move() {
  const head = { ...snake[0] }; // Crea una copia de la cabeza de la serpiente
  switch (direction) {
    case 'up':
      head.y--; // Mueve la cabeza hacia arriba
      break;
    case 'down':
      head.y++; // Mueve la cabeza hacia abajo
      break;
    case 'left':
      head.x--; // Mueve la cabeza hacia la izquierda
      break;
    case 'right':
      head.x++; // Mueve la cabeza hacia la derecha
      break;
  }

  snake.unshift(head); // Añadimos la nueva cabeza al inicio de la serpiente

  // Verificamos si la serpiente ha comido la comida
  if (head.x === food.x && head.y === food.y) {
    food = generateFood(); // Genera una nueva comida en una posición aleatoria
    increaseSpeed(); // Aumenta la velocidad del juego
    clearInterval(gameInterval); // Detiene el intervalo de tiempo actual
    gameInterval = setInterval(() => {
      move(); // Mueve la serpiente
      checkCollision(); // Verifica si hay colisiones
      draw(); // Dibuja el nuevo estado del juego
    }, gameSpeedDelay); // Establece un nuevo intervalo con la velocidad actualizada
  } else {
    snake.pop(); // Elimina el segmento de la cola de la serpiente si no ha comido la comida
  }
}

// Función para iniciar el juego
function startGame() {
  gameStarted = true; // Marca que el juego ha comenzado
  instructionText.style.display = 'none'; // Oculta el texto de instrucciones
  logo.style.display = 'none'; // Oculta el logotipo del juego
  gameInterval = setInterval(() => {
    move(); // Mueve la serpiente
    checkCollision(); // Verifica si hay colisiones
    draw(); // Dibuja el nuevo estado del juego
  }, gameSpeedDelay); // Establece el intervalo de actualización del juego
}

// Maneja el evento de presión de teclas para cambiar la dirección de la serpiente o iniciar el juego
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame(); // Inicia el juego si no ha comenzado y se presiona la barra espaciadora
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up'; // Cambia la dirección a arriba
        break;
      case 'ArrowDown':
        direction = 'down'; // Cambia la dirección a abajo
        break;
      case 'ArrowLeft':
        direction = 'left'; // Cambia la dirección a izquierda
        break;
      case 'ArrowRight':
        direction = 'right'; // Cambia la dirección a derecha
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress); // Añade un listener para las teclas presionadas

// Aumenta la velocidad del juego cada vez que la serpiente come la comida
function increaseSpeed() {
  // Ajusta la velocidad del juego según el valor actual del retraso
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5; // Reduce la velocidad en 5 ms
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3; // Reduce la velocidad en 3 ms
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2; // Reduce la velocidad en 2 ms
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1; // Reduce la velocidad en 1 ms
  }
}

// Verifica si la serpiente choca con los bordes del tablero o con sí misma
function checkCollision() {
  const head = snake[0]; // Obtiene la cabeza de la serpiente

  // Verifica si la cabeza de la serpiente choca con los bordes del tablero
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame(); // Reinicia el juego si hay una colisión
  }

  // Verifica si la cabeza de la serpiente choca con su propio cuerpo
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame(); // Reinicia el juego si hay una colisión con sí misma
    }
  }
}

// Reinicia el juego cuando hay una colisión
function resetGame() {
  updateHighScore(); // Actualiza la puntuación más alta si es necesario
  stopGame(); // Detiene el juego
  snake = [{ x: 10, y: 10 }]; // Reinicia la serpiente a la posición inicial
  food = generateFood(); // Genera una nueva comida en una posición aleatoria
  direction = 'right'; // Reinicia la dirección de la serpiente
  gameSpeedDelay = 200; // Reinicia la velocidad del juego
  updateScore(); // Actualiza la puntuación a cero
}

// Actualizamos la puntuación mostrada en la pantalla
function updateScore() {
  const currentScore = snake.length - 1; // La puntuación es la longitud de la serpiente menos uno (la comida no cuenta como segmento)
  score.textContent = currentScore.toString().padStart(3, '0'); // Muestra la puntuación actual en el elemento score con ceros a la izquierda si es
}

// Detiene el juego y muestra los elementos de la interfaz de usuario correspondientes
function stopGame() {
  clearInterval(gameInterval); // Detiene el intervalo que actualiza el estado del juego (detiene el movimiento de la serpiente)
  gameStarted = false; // Marca que el juego ha terminado
  instructionText.style.display = 'block'; // Muestra el texto de instrucciones para que el jugador sepa cómo reiniciar el juego
  logo.style.display = 'block'; // Muestra el logotipo del juego nuevamente
}

// Actualizamos la puntuación más alta mostrada en la pantalla si es necesario
function updateHighScore() {
  const currentScore = snake.length - 1; // Calcula la puntuación actual basada en la longitud de la serpiente menos uno (la comida no cuenta como segmento)
  if (currentScore > highScore) { // Verifica si la puntuación actual es mayor que la puntuación más alta registrada
    highScore = currentScore; // Actualiza la puntuación más alta
    highScoreText.textContent = highScore.toString().padStart(3, '0'); // Muestra la nueva puntuación más alta en el elemento highScore con ceros a la izquierda si es necesario
  }
  highScoreText.style.display = 'block'; // Asegura que la puntuación más alta sea visible en la pantalla
}
