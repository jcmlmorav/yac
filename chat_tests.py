import os
import chat
import unittest
import tempfile

from chat import app, DATABASE, init_db, insert_db

class ChatTestCase(unittest.TestCase):

    def setUp(self):
        self.db_fd, DATABASE = tempfile.mkstemp()
        app.testing = True
        self.app = app.test_client()
        with app.app_context():
            init_db()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(DATABASE)

    def test_user_logged(self):
        rv = self.app.get('/user-exists/guess')
        assert b'[]' in rv.data

    def test_history_empty(self):
        rv = self.app.get('history')
        assert b'[]' not in rv.data

if __name__ == '__main__':
    unittest.main()
