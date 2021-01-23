from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
from app.components._data import dataframeHandler
import numpy as np

# id del componente
componentId = "processor"
# Nombre del componente
componentName = "Processor"
# Descripción del componente
componentDescription = "Procesado de datos"
# Nombre de la opción en la interfaz
componentInterfaceName = "Procesar..."
# Acciones que puede realizar el componente y parámetros que genera la interfaz
Actions = [_v1.Action(
                      name="default", 
                      description="acción por defecto", 
                      params=[
                          _v1.Param(name="file", kind="file"),
                      ])
          ]
## Component processor
## This component handle the datasets import into the project
class Processor:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "default": self.defaultHandler,
        }
        self.pagination = {
            "startRow": None,
            "endRow": None,
        }
        
    # Update pagination params from request
    def _updatePagination (self, request: any):
        startRowParam = request.args.get('startRow')
        endRowParam = request.args.get('endRow')
        self.pagination["startRow"] = None if startRowParam is None else int(startRowParam)
        self.pagination["endRow"]= None if endRowParam is None else int(endRowParam)
        
    # default application handle which allow to import files though file handlers
    def defaultHandler(self):
        df = dataframeHandler.getDataframe()
        df[['rating']] = df[['rating']].fillna(df.mean(axis=0))
        pd.set_option("max_columns", None) # show all cols
        dataframeHandler.saveDataframe(df)

    def meanDataImputing():
        print("meanDataImputing")

    # call function triggered
    def __call__(self, request: any):
        self._updatePagination(request)
        action = request.args.get("action")
        if action is None:
            self.actions["default"]()
        elif action not in self.actions:
            raise Error('Accion {} desconocida'.format(action))
        else:
            self.actions[action]()
        return dataframeHandler.getAllData(self.pagination)

# component registration in the internal api
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=Processor)
_v1.register_component(component)