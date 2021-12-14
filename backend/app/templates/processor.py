from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
from app.components._data import dataframeHandler
import numpy as np
from sklearn.impute import KNNImputer
from sklearn import preprocessing

# ** ALL CONTENT COMENTED BETWEEN ASTERISCS MUST BE EDITED **

# ** Set the plugin id inside the internal api, it must be unique **
pluginId = "processorPluginExample"
# ** Set the plugin name, must be equals than the class name, and variable must be pluginName **
pluginName = "ProcessorPluginExample"
# ** Set the plugin description **
pluginDescription = "Plugin description"
# ** Name of the plugin in the interface **
pluginInterfaceName = "Procesar..."


# ** List of implemented actions with their parameters. It will be rendered in the UI forms. **
Actions = [ _v1.Action(
                    name="exampleAction",
                      description="example action",
                      params=[
                        _v1.Param(name="exampleSelect", kind="select", options=["option1", "option2", "option3"]),
                        _v1.Param(name="exampleNumber", kind="number"),
                        _v1.Param(name="exampleString", kind="string"),
                        _v1.Param(name="exampleFile", kind="file"),
                      ]),
            _v1.Action(
                      name="exampleAction",
                      description="example action",
                      params=[
                        _v1.Param(name="exampleSelect", kind="select", options=["option1", "option2", "option3"]),
                        _v1.Param(name="exampleNumber", kind="number"),
                        _v1.Param(name="exampleString", kind="string"),
                        _v1.Param(name="exampleFile", kind="file"),
                      ])
          ]

class ProcessorPluginExample:
    def __init__(self):
# ** Actions dict must be updated with new actions **
        self.actions = {
            "default": self.exampleActionHandler,
            "exampleAction": self.exampleActionHandler,
        }
        self.pagination = {
            "startRow": None,
            "endRow": None,
        }
    

    def exampleActionHandler(self, request):
        df = dataframeHandler.getDataframe()
        column = request.form.get('column')
        axis = request.form.get('axis')

        # ** HERE YOUR CODE FOR EXAMPLE ACTION HANDLER OF THIS PLUGIN ** 
        # modify df and it will be saved with dataframeHandler class in the 
        # local cache and then returned in         

        # Obtain the params from the request
        exampleSelect = request.form.get('exampleSelect')
        exampleNumber = request.form.get('exampleNumber')
        exampleString = request.form.get('exampleString')
        exampleFile = request.files['exampleFile']
        # do something like print params
        print("exampleSelect: ", exampleSelect)
        print("exampleNumber: ", exampleNumber)
        print("exampleString: ", exampleString)
        print("exampleFile: ", exampleFile)

        # always save the dataframe in the local cache
        dataframeHandler.saveDataframe(df)

# ** add new handlers for aditional actions and then place it in the actions dict **



# Don't change this method if is not necessary
    def _updatePagination (self, request: any):
        startRowParam = request.args.get('startRow')
        endRowParam = request.args.get('endRow')
        self.pagination["startRow"] = None if startRowParam is None else int(startRowParam)
        self.pagination["endRow"]= None if endRowParam is None else int(endRowParam)

# Don't change this method if is not necessary
    def __call__(self, request: any):
        print("ProcessorPluginExample called")
        self._updatePagination(request)
        action = request.args.get("action")
        if action is None:
            self.actions["default"](request)
        elif action not in self.actions:
            raise Error('Accion {} desconocida'.format(action))
        else:
            self.actions[action](request)
        return dataframeHandler.getAllData(self.pagination)
# Don't change that if is not necessary
component = _v1.ProcessorPlugin(name=pluginName, description=pluginDescription, interfacename=pluginInterfaceName, actions=Actions, handler_class=eval(pluginName))
_v1.register_processor_plugin(component)