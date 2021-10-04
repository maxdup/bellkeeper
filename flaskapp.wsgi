#!/usr/bin/python
import sys
import logging

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, "/var/www/bellkeeper")
sys.path.insert(0,"/var/www/bellkeeper/bellkeeper_server/env/lib/python3.7/site-packages")

from bellkeeper_server import create_app
application = create_app()
