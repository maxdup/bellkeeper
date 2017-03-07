#!/usr/bin/python
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/bellkeeper/bellkeeper-app/")

from bellkeeper-app import app as application
