from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
import numpy as np
from app.components._data import dataframeHandler

# id del componente
componentId = "data"
# Nombre del componente
componentName = "data"
# Descripción del componente
componentDescription = "Edición de datos y paginación"
# Nombre de la opción en la interfaz
componentInterfaceName = "Modificar..."
# Acciones que puede realizar el componente y parámetros que genera la interfaz
Actions = [
            _v1.Action(
                      name="updateCell", 
                      description="cambia el valor de una celda", 
                      params=[
                          _v1.Param(name="valor", kind="string"),
                      ]),
            _v1.Action(
                      name="setType", 
                      description="Transforma una columna a un tipo concreto", 
                      params=[
                          _v1.Param(name="tipo", options=["object", "int64", "float64", "bool", "datetime64"], kind="select"),
                      ])
          ]
## Component importer
## This component handle the datasets import into the project
class Data:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "setType": self.defaultHandler,
        }
        self.pagination = {
            "startRow": None,
            "endRow": None,
        }
        
    # Update pagination params from request
    def _updatePagination (self, request: any):
        startRowParam = request.args.get('startRow')
        endRowParam = request.args.get('endRow')
        column = request.form.get('column')
        self.pagination["startRow"] = None if startRowParam is None else int(startRowParam)
        self.pagination["endRow"]= None if endRowParam is None else int(endRowParam)
        

    # default application handle which allow to import files though file handlers
    def defaultHandler(self, file):
        extension = Path(file.filename).suffix
        if extension not in self.fileHandlers:
            raise Error('Extensión {} no soportada'.format(extension))
        self.fileHandlers[extension](file)
    
    # call function triggered
    def __call__(self, request: any):
        self._updatePagination(request)
        file = request.files['file']
        action = request.args.get("action")
        if action is None:
            self.actions["default"](file)
        elif action not in self.actions:
            raise Error('Accion {} desconocida'.format(action))
        else:
            self.actions[action](file)
        return dataframeHandler.getAllData(self.pagination)

# component registration in the internal api
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=Data)
_v1.register_component(component)