import os
from flask import Flask, Config
from flask_cors import CORS
from bellkeeper_server.bellkeeper import bpkeeper

configuration = Config('/')
configuration.from_object('bellkeeper_server.config')


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(bpkeeper)
    app.config.update(configuration)
    app.url_map.strict_slashes = True
    return app
