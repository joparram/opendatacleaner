from ..api import _v1
from ..components.importer import componentName
from flask import session, render_template, request, redirect, url_for
from flask_restful import Resource, Api
from app.components._components import Components
from app.components._plugins import ImporterPlugins
from app.error import Error

class ImporterController(Resource):
    def __init__(self):
        print("fin")

    def post(self):
        data = None
        componentExists = False
        components: Components = _v1._private.container[Components]
        importerPlugins: Components = _v1._private.container[ImporterPlugins]
        pluginName = request.form.get('plugin')
        if pluginName == None:
            for component in components:
                if component.name == componentName:
                    componentExists = True
                    data = _v1._private.container[component.handler_class](request)
        else:
            for plugins in importerPlugins:
                if plugins.name == pluginName:
                    componentExists = True
                    data = _v1._private.container[plugins.handler_class](request)

        if componentExists == False:
            raise Error('El plugin {} no existe o no se ha instalado'.format(pluginName)) 
        return data