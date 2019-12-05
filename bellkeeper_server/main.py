from flask import Blueprint, request
from subprocess import call

import threading

import os
from config import passwords

main = Blueprint('main', __name__)


def unlock():
    call(["gpio", "-g", "write", "14", "0"])


def lock():
    call(["gpio", "-g", "write", "14", "1"])


@main.route('/', methods=['POST'])
def index():

    if request.form.get("password") in passwords:
        call(["gpio", "-g", "mode", "14", "out"])
        unlock()
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
