from ..api import _v1
from ..components.database_exporter import componentName
from flask import session, render_template, request, redirect, url_for
from flask_restful import Resource, Api
from app.components._components import Components
from app.components._plugins import DatabaseExporterPlugins
from app.error import Error
from flask_jsonpify import jsonify
from app.utils.encoders import dataclassToJson

class DatabaseExporterController(Resource):
    def __init__(self):
        print("__init__")

    # Obtiene la configuración del componente y sus plugins
    def get(self):
        components: Components = _v1._private.container[Components]
        dataPlugins: DatabaseExporterPlugins = _v1._private.container[DatabaseExporterPlugins]
        component = next(x for x in components if x.name == componentName )
        cj = dataclassToJson(component)
        cp = dataclassToJson(dataPlugins)
        print(dataPlugins)
        cj["plugins"] = cp
        return jsonify(cj)

    # Método que ejecuta el componente o un plugin del componente
    def post(self):
        data = None
        components: Components = _v1._private.container[Components]
        plugins: Components = _v1._private.container[DatabaseExporterPlugins]
        pluginName = request.args.get('plugin')
        if pluginName == None:
            component = next(x for x in components if x.name == componentName )
            data = _v1._private.container[component.handler_class](request)
        else:
            plugin = None
            try:
                plugin = next(x for x in plugins if x.name == pluginName )
            except:
                raise Error('El plugin {} no existe o no se ha instalado'.format(pluginName))
            data = _v1._private.container[plugin.handler_class](request)
        return jsonify(data)
