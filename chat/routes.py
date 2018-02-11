# -*- coding: utf-8 -*-

import sqlite3

from flask import g, jsonify, render_template
from chat import app, init_db, query_db

@app.route('/')
def index():
    init_db()
    return render_template('index.html')

@app.route('/history')
def history():
    return jsonify(query_db('select * from messages'))

@app.route('/user-exists/<username>')
def user_exists(username):
    return jsonify(query_db('select * from users where user = "{0}"'.format(username)))
