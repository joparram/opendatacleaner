from ..api import _v1
from ..components.importer import componentName
from flask import session, render_template, request, redirect, url_for
from flask_restful import Resource, Api
from app.components._components import Components
from app.components._plugins import ImporterPlugins
from app.error import Error
from app.utils.encoders import dataclassToJson
from flask_jsonpify import jsonify


class ComponentesController(Resource):
    def get(self):
        componentes = _v1._private.container[Components]
        print(dataclassToJson(componentes))
        return jsonify(dataclassToJson(componentes))