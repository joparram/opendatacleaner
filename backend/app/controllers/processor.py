from ..api import _v1
from ..components.processor import componentName
from flask import session, render_template, request, redirect, url_for
from flask_restful import Resource, Api
from app.components._components import Components
from app.components._plugins import ProcessorPlugins
from app.error import Error
from flask_jsonpify import jsonify
from app.utils.encoders import dataclassToJson

class ProcessorController(Resource):
    def __init__(self):
        print("__init__")

    # Obtiene la configuración del componente y sus plugins
    def get(self): 
        components: Components = _v1._private.container[Components]
        processorPlugins: ProcessorPlugins = _v1._private.container[ProcessorPlugins]
        component = next(x for x in components if x.name == componentName )
        cj = dataclassToJson(component)
        cp = dataclassToJson(processorPlugins)
        print(processorPlugins)
        cj["plugins"] = cp
        return jsonify(cj)

    # Método que ejecuta el componente o un plugin del componente
    def post(self):
        data = None
        components: Components = _v1._private.container[Components]
        plugins: Components = _v1._private.container[ProcessorPlugins]
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
        