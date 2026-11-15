from flask import Flask, render_template
from config import GAME_CONFIG
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-breakout')

@app.route('/')
def index():
    return render_template('index.html', config=GAME_CONFIG)

if __name__ == '__main__':
    app.run(debug=True, port=5000)