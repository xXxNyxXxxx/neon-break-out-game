# Neon Breakout (Flask & JavaScript Edition)

A modern, feature-rich, arcade-style **Breakout** web application built with **Python (Flask)**, **Jinja2**, and **HTML5 Canvas (Vanilla JavaScript)**. Designed with a sleek dark/light neon UI, difficulty modes, dynamic power-ups, retro Web Audio sound effects, and a persistent per-difficulty Top 3 leaderboard.

![Python](https://img.shields.io/badge/Python-3.13%2B-blue?style=flat&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.1-green?style=flat&logo=flask)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=flat&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-purple.svg)

---

## Features

- **Modular Flask & Jinja Architecture:** Clean separation of concerns with centralized game configurations in Python (`config.py`).
- **3 Difficulty Tiers (Easy, Normal, Hard):** Adjusts ball speed, paddle width, starting lives, and score multipliers dynamically.
- **Power-Up System:** Bricks have a chance to drop special capsules that trigger temporary buffs:
  - 🔵 **Wider Paddle** (`EXPAND`)
  - 🟢 **Extra Life** (`EXTRA_LIFE`)
  - 🟡 **Slow Ball** (`SLOW_BALL`)
  - 🟣 **Bonus Points** (`BONUS_POINTS`)
- **Retro Web Audio Synthesizer (`sound.js`):** Zero external `.mp3` files required! Generates authentic arcade beeps, brick shatters, and victory chimes directly in the browser with an instant Mute toggle.
- **Difficulty-Specific Top 3 Leaderboards:** Tracks and stores the top 3 high scores independently for Easy, Normal, and Hard modes using browser `localStorage`, complete with crown badges and player names.
- **Theme & State Persistence:** Seamless Dark and Light mode toggle with automatic preference and player name remembering.

---

## ⚙️ Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/breakout-web.git](https://github.com/YOUR_USERNAME/breakout-web.git)
   cd breakout-web

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows (Git Bash / PowerShell):
   source venv/Scripts/activate
   # On macOS/Linux:
   source venv/bin/activate
3. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
4. **set up your .env file:**
   ```bash
   Create a .env file in the root folder with the following variables:
      FLASK_APP=app.py
      FLASK_DEBUG=True
      SECRET_KEY=your-super-secret-key
5. **Run the application:**
    ```bash
    python app.py
    Open your browser and navigate to http://127.0.0.1:5000 to run the app locally!

---

## 📄 License
This project is open-source and available under the MIT License.

---
## Project Directory Structure

```text
breakout-web/
├── app.py                  # Flask application routes and server
├── config.py               # Centralized game constants and difficulty rules
├── requirements.txt        # Python dependencies (Flask, python-dotenv, gunicorn)
├── .env                    # Local environment variables (FLASK_DEBUG, SECRET_KEY)
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
├── README.md               # Project documentation
├── templates/
│   ├── base.html           # Master layout template
│   └── index.html          # Game UI, Start Modal, HUD, Canvas, Leaderboard sidebar
└── static/
    ├── css/
    │   └── style.css       # Modern dark/light arcade styling and responsive layout
    └── js/
        ├── sound.js        # Web Audio API synthesizer for retro sound effects
        ├── storage.js      # Manages localStorage for player name, theme, and per-mode Top 3
        ├── entities.js     # ES6 classes (Paddle, Ball, Brick, PowerUp)
        └── game.js         # Core game engine, physics, collision detection, and UI loop

