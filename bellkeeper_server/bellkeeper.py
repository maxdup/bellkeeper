from flask import Blueprint, request
import threading
import RPi.GPIO as GPIO
from bellkeeper_server.config import passwords

bpkeeper = Blueprint('main', __name__)


SIGNAL = 14
GPIO.setmode(GPIO.BCM)
GPIO.setup(SIGNAL, GPIO.OUT)

def unlock():
    GPIO.output(SIGNAL, GPIO.HIGH)
    #call(["gpio", "-g", "write", "14", "0"])


def lock():
    GPIO.output(SIGNAL, GPIO.LOW)
    #call(["gpio", "-g", "write", "14", "1"])


@bpkeeper.route('/', methods=['POST'])
def index():

    if request.form.get("password") in passwords:
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


@bpkeeper.route('/poll/', methods=['GET'])
def poll():
    return ('', 204)
