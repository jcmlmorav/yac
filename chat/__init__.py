# -*- coding: utf-8 -*-

import sqlite3

from flask import Flask, g, jsonify, render_template
from flask_socketio import emit, SocketIO

app = Flask(__name__)

app.config['SECRET_KEY'] = 'yac_secret_token'
socketio = SocketIO(app)

if __name__ == '__main__':
    socketio.run(app)

DATABASE = 'database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def insert_db(query):
    db = get_db()
    cur = db.execute(query)
    db.commit()
    cur.close()

import chat.routes
import chat.consumers
