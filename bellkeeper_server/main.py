from flask import Blueprint, request
import json
from subprocess import call
import threading

main = Blueprint('main', __name__)

password = "patate"

@main.route('/', methods=['POST'])
def index():
    def lock():
        call(["gpio", "-g", "write", "14", "1"])

    if request.form.get("password") == password:
        call(["gpio", "-g", "mode", "14", "out"])
        if request.form.get("password") == password:
            call(["gpio", "-g", "write", "14", "0"])
            delay = 3
            if request.form.get("duration"):
                try:
                    delay = max(1, min(20, int(request.form.get("duration"))))
                except:
                    pass

            threading.Timer(delay, lock).start()

        return ('', 200)
    else:
        return ('', 403)

@main.route('/poll/', methods=['GET'])
def poll():
    return ('', 204)

