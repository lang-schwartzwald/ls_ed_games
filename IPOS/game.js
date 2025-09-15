 const allComponents = [
      { name: "Keyboard", type: "Input", img: "images/keyboard.avif" },
      { name: "Mouse", type: "Input", img: "images/mouse.jpg" },
      { name: "Monitor", type: "Output", img: "images/monitor.jpg" },
      { name: "CPU", type: "Process", img: "images/ram.JPG" },
      { name: "Printer", type: "Output", img: "images/printer.jpg" },
      { name: "Hard Drive", type: "Storage", img: "images/harddrive.jpg" },
      { name: "RAM", type: "Storage", img: "images/ram.jpg" },
      { name: "Scanner", type: "Input", img: "images/scanner.jpg" },
      { name: "Speakers", type: "Output", img: "images/speakers.png" },
      { name: "Motherboard", type: "Process", img: "images/motherboard.jpg" },
      { name: "SSD", type: "Storage", img: "images/SSD.jpg" },
      { name: "Webcam", type: "Input", img: "images/webcam.jpg" },
    // Modern video gaming components
    { name: "Game Controller", type: "Input", img: "images/gamecontroller.jpg" },
    { name: "VR Headset", type: "Output", img: "images/vrheadset.jpg" },
    { name: "Graphics Card (GPU)", type: "Process", img: "images/GPU.jpg" },
    { name: "Gaming Headset", type: "Output", img: "images/headset.avif" },
    { name: "Streaming Microphone", type: "Input", img: "images/microphone.avif" },
    
    ];

    let remainingComponents = [];
    let score = 0;
    let timeLeft = 30;
    let timerInterval = null;
    let currentComp = null;
    let gameActive = false;

    function getRandomComponent() {
      if (remainingComponents.length === 0) return null;
      const idx = Math.floor(Math.random() * remainingComponents.length);
      return remainingComponents[idx];
    }

    function renderComponent() {
      currentComp = getRandomComponent();
      if (!currentComp) {
        endGame();
        return;
      }
      document.getElementById("game").innerHTML = `
        <div class="component">
          <img src="${currentComp.img}" alt="${currentComp.name}">
          <div class="component-name">${currentComp.name}</div>
          <div>
            <button class="btn" onclick="choose('Input')">Input</button>
            <button class="btn" onclick="choose('Process')">Process</button>
            <button class="btn" onclick="choose('Output')">Output</button>
            <button class="btn" onclick="choose('Storage')">Storage</button>
          </div>
        </div>
      `;
    }

    window.choose = function(type) {
      if (!gameActive || timeLeft <= 0 || !currentComp) return;
      const resultEl = document.getElementById("result");
      if (type === currentComp.type) {
        score++;
        resultEl.innerText = "Correct!";
        resultEl.className = "correct";
        animateScore();
      } else {
        resultEl.innerText = `Wrong! That is a ${currentComp.type} device.`;
        resultEl.className = "wrong";
      }
      document.getElementById("score").innerText = `Score: ${score}`;
      // Remove the answered component
      remainingComponents = remainingComponents.filter(comp => comp.name !== currentComp.name);
      // Next component or end game if none left
      setTimeout(() => {
        resultEl.innerText = "";
        resultEl.className = "";
        if (remainingComponents.length === 0) {
          endGame();
        } else if (timeLeft > 0) {
          renderComponent();
        }
      }, 650);
    }

    function animateScore() {
      const scoreEl = document.getElementById("score");
      scoreEl.classList.remove("score-animate");
      void scoreEl.offsetWidth; // force reflow
      scoreEl.classList.add("score-animate");
    }
    function animateTimer() {
      const timerEl = document.getElementById("timer");
      timerEl.classList.remove("timer-animate");
      void timerEl.offsetWidth;
      timerEl.classList.add("timer-animate");
    }

    function endGame() {
      gameActive = false;
      clearInterval(timerInterval);
      document.getElementById("game").innerHTML = `<div class="gameover">
        <span>🎉 Game Over! 🎉</span></div>`;
      let reason = (remainingComponents.length === 0)
        ? "You've answered all components!"
        : "Time's Up!";

      // Show correct/incorrect key and unanswered components
      let keyHtml = `<div style="margin:24px 0 10px 0;text-align:center;font-size:1.2em;font-weight:600;">Key:</div><ul style="list-style:none;padding:0;text-align:left;max-width:500px;margin:0 auto;">`;
      let answeredNames = allComponents.filter(comp => !remainingComponents.some(rem => rem.name === comp.name));
      answeredNames.forEach(comp => {
        keyHtml += `<li style='margin-bottom:18px;display:flex;align-items:center;gap:18px;'>
          <img src='${comp.img}' alt='${comp.name}' style='width:60px;height:60px;object-fit:contain;border-radius:10px;border:2px solid #ffd600;background:#fff;box-shadow:0 2px 8px #e52e71a3;'>
          <span style='color:#ffd600;font-weight:bold;'>${comp.name}</span> — <span style='color:#fff;'>${comp.type}</span>
        </li>`;
      });
      keyHtml += `</ul>`;

      let unansweredHtml = "";
      if (remainingComponents.length > 0) {
        unansweredHtml = `<div style='margin:18px 0 10px 0;text-align:center;font-size:1.1em;color:#ff3c3c;font-weight:600;'>Unanswered Components:</div><ul style='list-style:none;padding:0;text-align:left;max-width:500px;margin:0 auto;'>`;
        remainingComponents.forEach(comp => {
          unansweredHtml += `<li style='margin-bottom:18px;display:flex;align-items:center;gap:18px;'>
            <img src='${comp.img}' alt='${comp.name}' style='width:60px;height:60px;object-fit:contain;border-radius:10px;border:2px solid #ffd600;background:#fff;box-shadow:0 2px 8px #e52e71a3;'>
            <span style='color:#ffd600;font-weight:bold;'>${comp.name}</span> — <span style='color:#fff;'>${comp.type}</span>
          </li>`;
        });
        unansweredHtml += `</ul>`;
      }

      document.getElementById("result").innerHTML =
        `${reason} Your score: ${score} / ${allComponents.length}<br>${keyHtml}${unansweredHtml}`;
      document.getElementById("result").className = "correct";
      document.getElementById("restartArea").style.display = "flex";
      document.getElementById("scoreTimer").classList.remove("active");
    }

    function startTimer() {
      timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time: ${timeLeft}s`;
        animateTimer();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endGame();
        }
      }, 1000);
    }

    function hideGameAreas() {
      document.getElementById("game").innerHTML = "";
      document.getElementById("result").innerText = "";
      document.getElementById("result").className = "";
      document.getElementById("scoreTimer").classList.remove("active");
      document.getElementById("restartArea").style.display = "none";
    }

    function startGame() {
      hideGameAreas();
      score = 0;
      timeLeft = 30;
      remainingComponents = [...allComponents];
      gameActive = true;
      document.getElementById("score").innerText = `Score: 0`;
      document.getElementById("timer").innerText = `Time: 30s`;
      document.getElementById("scoreTimer").classList.add("active");
      document.getElementById("startArea").style.display = "none";
      renderComponent();
      startTimer();
    }

    function restartGame() {
      score = 0;
      timeLeft = 30;
      remainingComponents = [...allComponents];
      gameActive = true;
      document.getElementById("score").innerText = `Score: 0`;
      document.getElementById("timer").innerText = `Time: 30s`;
      document.getElementById("scoreTimer").classList.add("active");
      document.getElementById("restartArea").style.display = "none";
      renderComponent();
      startTimer();
      document.getElementById("result").innerText = "";
      document.getElementById("result").className = "";
    }

    // On load, show only start button
    hideGameAreas();
    document.getElementById("startArea").style.display = "flex";