from flask import Blueprint

main = Blueprint('main', __name__)


@main.route('/', methods=['POST'])
def index():
    return ('', 200)

@main.route('/online/', methods=['POST'])
def online():
    print(request.data)
    return ('', 200)

