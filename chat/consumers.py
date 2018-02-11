# -*- coding: utf-8 -*-

import sqlite3

from flask_socketio import emit
from flask import g
from chat import app, socketio, insert_db

@socketio.on('joined')
def handle_joined_event(username):
    message = '{0} has joined!'.format(username)
    insert_db('insert into users (user) values ("{0}")'.format(username))
    insert_db('insert into messages (message) values ("{0}")'.format(message))
    emit('response',
        {'message': message},
        broadcast=True)

@socketio.on('message')
def handle_message_event(message, user):
    insert_db("insert into messages (user, message) values ('"+user+"', '"+message+"')")
    emit('response',
        {'message': message, 'user': user},
        broadcast=True)

@socketio.on('exit')
def handle_exit_event(username):
    message = '{0} has exited...'.format(username)
    insert_db('delete from users where user = "{0}"'.format(username))
    insert_db('insert into messages (message) values ("{0}")'.format(message))
    emit('response',
        {'message': message},
        broadcast=True)
