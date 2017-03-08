from flask import Blueprint, request
import json

main = Blueprint('main', __name__)

password = "patate"

@main.route('/', methods=['POST'])
def index():
    if request.form.get("password") == password:
        return ('', 200)
    else:
        return ('', 403)

@main.route('/poll/', methods=['GET'])
def poll():
    return ('', 204)

