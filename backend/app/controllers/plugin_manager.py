from ..api import _v1
from ..components.plugin_manager import componentName
from flask import session, render_template, request, redirect, url_for, send_file
from flask_restful import Resource, Api
from app.components._components import Components
from flask_jsonpify import jsonify
from app.utils.encoders import dataclassToJson
from pathlib import Path, PosixPath

class PluginManagerController(Resource):
    def __init__(self):
        print("__init__")

    # Obtiene la configuración del componente
    def get(self):
        components: Components = _v1._private.container[Components]
        component = next(x for x in components if x.name == componentName )
        cj = dataclassToJson(component)
        return jsonify(cj)

    # Método que ejecuta el componente o un plugin del componente
    def post(self):
        data = None
        components: Components = _v1._private.container[Components]
        component = next(x for x in components if x.name == componentName )
        data = _v1._private.container[component.handler_class](request)
        response = None
        if (type(response) is dict):
            response = jsonify(data)
        elif (type(data) is PosixPath):
            response = send_file(data, attachment_filename=data.name, as_attachment=True)
        elif (type(data) is Path):
            response = send_file(data, attachment_filename=data.name, as_attachment=True)
        else:
            response = data
        return response

