# Single source of truth for rows, difficulties, and power-up odds
GAME_CONFIG = {
    "canvas_width": 800,
    "canvas_height": 600,
    "difficulties": {
        "easy": {
            "ball_speed": 4,
            "paddle_width": 130,
            "lives": 4,
            "multiplier": 1.0,
            "label": "Easy"
        },
        "normal": {
            "ball_speed": 6,
            "paddle_width": 100,
            "lives": 3,
            "multiplier": 1.5,
            "label": "Normal"
        },
        "hard": {
            "ball_speed": 8,
            "paddle_width": 75,
            "lives": 2,
            "multiplier": 2.0,
            "label": "Hard"
        }
    },
    "power_ups": {
        "expand": {"color": "#06b6d4", "duration": 10000, "label": "Wider Paddle"},
        "extra_life": {"color": "#10b981", "duration": 0, "label": "+1 Life"},
        "slow_ball": {"color": "#f59e0b", "duration": 8000, "label": "Slow Ball"},
        "bonus_pts": {"color": "#8b5cf6", "duration": 0, "label": "+250 Pts"}
    }
}