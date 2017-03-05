import os
from flask import Flask, request, Response, g
from main import main

app = Flask(__name__)
app.register_blueprint(main)

app.debug = True
app.url_map.strict_slashes = True

if __name__ == "__main__":
    app.run()
