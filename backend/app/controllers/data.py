from ..api import _v1
from ..components._data import dataframeHandler
from flask import session, render_template, request, redirect, url_for
from flask_restful import Resource, Api
from app.components._components import Components
from app.components._plugins import ImporterPlugins
from app.error import Error
from flask_jsonpify import jsonify
from app.utils.encoders import dataclassToJson

class DataController(Resource):
    def __init__(self):
        self.pagination = {
            "startRow": None,
            "endRow": None,
        }
        
    def _updatePagination (self, request: any):
        startRowParam = request.args.get('startRow')
        endRowParam = request.args.get('endRow')
        self.pagination["startRow"] = None if startRowParam is None else int(startRowParam)
        self.pagination["endRow"]= None if endRowParam is None else int(endRowParam)
        print(self.pagination)
        print(request.args)

    def get(self):
        self._updatePagination(request)
        data = dataframeHandler.getAllData(self.pagination)
        return data
