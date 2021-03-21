import argparse
import importlib
import pkgutil
import sys

from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
import app.plugin_loader as plugin_loader
from app.api import _v1
from app.components._plugins import ImporterPlugins, ExporterPlugins, DatabaseExporterPlugins, ProcessorPlugin
from app.controllers.processor import ProcessorController
from app.controllers.importer import ImporterController
from app.controllers.database_exporter import DatabaseExporterController
from app.controllers.components import ComponentesController
from app.controllers.data import DataController
from app.controllers.paginated_data import PaginatedDataController

from app.error import Error

app = Flask(__name__)
api = Api(app)
# Load plugins from plugin directory
app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'
CORS(app)
plugin_loader.load_plugins()

@app.route("/")
def hello():
    return jsonify({'text':'Hello World!'})

api.add_resource(ProcessorController, '/processor')  # Route_1
api.add_resource(ImporterController, '/importer')  # Route_1
api.add_resource(ComponentesController, '/components')  # Route_1
api.add_resource(PaginatedDataController, '/paginated_data')  # Route_1
api.add_resource(DatabaseExporterController, '/database_exporter')  # Route_1
api.add_resource(DataController, '/data')  # Route_1

@app.errorhandler(Error)
def handle_bad_request(error):
    payload = dict(error.payload or ())
    payload['status'] = error.status
    payload['message'] = error.message
    return jsonify(payload), error.status

if __name__ == '__main__':
   app.run(port=5002)
