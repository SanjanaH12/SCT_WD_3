<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Tic Tac Toe — Play vs Human or Computer</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container" role="main">
    <header>
      <div>
        <h1>Tic Tac Toe</h1>
        <div class="small">Play against a friend or the computer — choose mode & difficulty.</div>
      </div>
      <div class="controls">
        <label class="small">Mode:
          <select id="modeSelect">
            <option value="human">Human vs Human</option>
            <option value="computer">Play vs Computer</option>
          </select>
        </label>
        <label class="small difficulty">AI:
          <select id="difficultySelect">
            <option value="easy">Easy</option>
            <option value="hard" selected>Hard (optimal)</option>
          </select>
        </label>
        <button id="resetBtn">Reset</button>
      </div>
    </header>

    <div class="line" aria-hidden="true"></div>

    <div id="board" class="board" aria-label="Tic Tac Toe board">
      <!-- 9 cells will be injected by script.js -->
    </div>

    <div class="status" id="status">Current turn: <span id="turnPlayer">X</span></div>

    <footer>
      <div class="small">X goes first. Click an empty cell to place your mark.</div>
      <div class="small">Made with ❤️ — open in browser to play</div>
    </footer>
  </div>

  <script src="script.js" defer></script>
</body>
</html>
