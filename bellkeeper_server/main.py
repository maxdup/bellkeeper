from flask import Blueprint, request
import json
from subprocess import call
import threading

import requests
from lxml import etree
from twilio.rest import Client as twilioClient
from config import *

main = Blueprint('main', __name__)

def unlock():
    call(["gpio", "-g", "write", "14", "0"])

def lock():
    call(["gpio", "-g", "write", "14", "1"])

@main.route('/', methods=['POST'])
def index():

    if request.form.get("password") == password:
        call(["gpio", "-g", "mode", "14", "out"])
        if request.form.get("password") == password:
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


def findHomies():
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
def whosThere():
    homies = findHomies()
    response = []
    for homie in homies:
        response.append(homie['name'])

    return (str(response), 200)



@main.route('/poll/', methods=['GET'])
def poll():
    return ('', 204)


@main.route('/sms', methods=['POST', 'GET'])
def sms():
    if not (sender_sms and ACCOUNT_SID and AUTH_TOKEN):
        return ('', 403)
    elif 'Body' not in request.form or 'From' not in request.form:
        return ('', 406)

    elif request.form['From'] not in whitelist:
        client = twilioClient(ACCOUNT_SID, AUTH_TOKEN)
        result = client.messages.create(
            to=int(request.form['From']),
            from_=sender_sms,
            body='forbidden')

    elif request.form['Body'].lower() == 'homies':
        homies = findHomies()

        message = ''
        for homie in homies:
            message += homie['name'] + ', '
        message = message[:-2]

        client = twilioClient(ACCOUNT_SID, AUTH_TOKEN)
        result = client.messages.create(
            to=int(request.form['From']),
            from_=sender_sms,
            body=message)

    elif request.form['Body'].lower == 'unlock':
        unlock()
        threading.Timer(15, lock).start()

    return ('', 200)
