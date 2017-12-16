from flask import Blueprint, request
import json
from subprocess import call
import threading

import requests
from lxml import etree
from config import post_data, dwellers

#from bs4 import BeautifulSoup

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


def findDevices():
    # is based on the d-link DIR-655 router
    r = requests.post('http://192.168.0.1/login.cgi', data=post_data)
    r = requests.get('http://192.168.0.1/device.xml=wireless_list')
    tree = etree.fromstring(r.text.encode('utf-8'))

    homies = []
    for dweller in dwellers:
        for device in tree[0].findall('mac'):
            if device.text == dweller['mac']:
                homies.append(dweller)
    print(homies)
    return homies

@main.route('/whosthere', methods=['GET'])
def whosthere():
    homies = findDevices()
    response = []
    for homie in homies:
        response.append(homie['name'])

    return (str(response), 200)



@main.route('/poll/', methods=['GET'])
def poll():
    return ('', 204)

