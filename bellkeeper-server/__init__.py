import os
from flask import Flask, request, Response, g
from flask_cors import CORS, cross_origin
from main import main

app = Flask(__name__)
CORS(app)
app.register_blueprint(main)

app.debug = True
app.url_map.strict_slashes = True

if __name__ == "__main__":
    app.run()
