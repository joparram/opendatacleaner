from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
import numpy as np
from app.components._data import dataframeHandler
import app.plugin_loader as plugin_loader
import re
import sys
# id del componente
componentId = "pluginManager"
# Nombre del componente
componentName = "PluginManager"
# Descripción del componente
componentDescription = "Manage plugins"
# Nombre de la opción en la interfaz
componentInterfaceName = "Plugins management"
# Acciones que puede realizar el componente y parámetros que genera la interfaz
Actions = [
            _v1.Action(
                      name="downloadPluginTemplate",
                      description="Descarga una plantilla de plugin",
                      params=[
                          _v1.Param(name="component", options=["data", "exporter", "importer", "processor", "databaseExporter"], kind="select"),
                      ]),
            _v1.Action(
                      name="uploadPlugin",
                      description="upload plugin",
                      params=[
                          _v1.Param(name="plugin", kind="file"),
                      ]),
            _v1.Action(
                      name="deletePlugin",
                      description="delete plugin",
                      params=[
                          _v1.Param(name="pluginName", kind="string"),
                          _v1.Param(name="component", options=["data", "exporter", "importer", "processor", "databaseExporter"], kind="select"),
                      ]),
          ]
## Component importer
## This component handle the datasets import into the project
class PluginManager:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "default": self.downloadPluginTemplateHandler,
            "downloadPluginTemplate": self.downloadPluginTemplateHandler,
            "uploadPlugin": self.uploadPluginHandler,
            "deletePlugin": self.deletePluginHandler,
        }

    def downloadPluginTemplateHandler(self, request):
        _component = request.form.get("component")
        print("component: ", _component)
        path = Path("templates/{}.py".format(_component))
        if (path.exists()):
            print("path exists: ", path)
        print(path)
        return path

    def uploadPluginHandler(self, request):
        if request.files:
            _file = request.files.get("plugin")
            _componentName = re.search('pluginName(.*)"', _file.read().decode("utf-8")).group(1).replace("=", "").replace("\"", "").replace("'", "").strip()
            _file.seek(0)
            _file.save(Path("app/plugins/{}.py".format(_componentName)))
            plugin_loader.load_plugins()
            return "Plugin uploaded"
        else:
            raise Error('No se ha proporcionado ningun archivo')

    def deletePluginHandler(self, request):
        _plugin = request.form.get("pluginName")        
        _component = request.form.get("component") 
        if Path("app/plugins/{}.py".format(_plugin)).exists():
            # unregister component from api
            if _component == "processor":
                _v1.unregister_processor_plugin(_plugin)
            elif _component == "exporter":
                _v1.unregister_exporter_plugin(_plugin)
            elif _component == "importer":
                _v1.unregister_importer_plugin(_plugin)
            elif _component == "data":
                _v1.unregister_data_plugin(_plugin)
            elif _component == "databaseExporter":
                _v1.unregister_database_exporter_plugin(_plugin)
            else:
                raise Error('Componente {} desconocido'.format(_component))
    
            print("holaaa")
            # delete plugin file
            Path("app/plugins/{}.py".format(_plugin)).unlink()
            # reload plugins
            plugin_loader.load_plugins()
            # remove plugin from sys.modules imports
            _pluginmodule = "app.plugins.{}".format(_plugin)
            if _pluginmodule in sys.modules:
                print("removing module: ", _pluginmodule)
                del sys.modules[_pluginmodule]
            return "Plugin deleted"
        else:
            raise Error('Plugin {} not found'.format(_plugin))


    # call function triggered
    def __call__(self, request: any):
        response = None
        action = request.args.get("action")
        print("accion: ", action)
        if action is None:
            response = self.actions["default"](request)
        elif action not in self.actions:
            raise Error('Accion {} desconocida'.format(action))
        else:
            response = self.actions[action](request)
        return response

# component registration in the internal api
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=PluginManager)
_v1.register_component(component)
