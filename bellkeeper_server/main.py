from flask import Blueprint, request
import json
from subprocess import call
import threading

import os
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
    homies = []
    for dweller in dwellers:
        if dweller['type'] == 'apple':
            response = os.system(
                "hping3 -2 -c 3 -p 5353 " + dweller['ip'])
    for dweller in dwellers:
        response = os.system("ping -c 1 " + dweller['ip'])
        if response == 0:
            homies.append(dweller)
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

    elif not next(x for x in dwellers if x['phone'] == request.form['From']):
        client = twilioClient(ACCOUNT_SID, AUTH_TOKEN)
        result = client.messages.create(
            to=int(request.form['From']),
            from_=sender_sms,
            body='forbidden')

    elif request.form['Body'].lower() == 'help':
        message = 'commands:\n'\
                  'help - sends this help message\n'\
                  'unlock - unlocks the door for 15 seconds\n'\
                  'homies - lists roommates currently at home'
        sms_response(message, request.form['From'])

    elif request.form['Body'].lower() == 'homies':
        homies = findHomies()

        message = ''
        if homies:
            for homie in homies:
                message += homie['name'] + ', '
            message = message[:-2]
        else:
            message = 'no one is home'
        sms_response(message, request.form['From'])


    elif request.form['Body'].lower == 'unlock':
        unlock()
        threading.Timer(15, lock).start()

    return ('', 200)

def sms_response(message, to):
    client = twilioClient(ACCOUNT_SID, AUTH_TOKEN)
    result = client.messages.create(to=int(to),
                                    from_=sender_sms,
                                    body=message)
