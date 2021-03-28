from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
import numpy as np
from app.components._data import dataframeHandler

# id del componente
componentId = "importer"
# Nombre del componente
componentName = "Importer"
# Descripción del componente
componentDescription = "Importar datos al proyecto"
# Nombre de la opción en la interfaz
componentInterfaceName = "Importar..."
# Acciones que puede realizar el componente y parámetros que genera la interfaz
Actions = [_v1.Action(
                      name="default",
                      description="acción por defecto",
                      params=[
                          _v1.Param(name="file", kind="file"),
                      ])
          ]
## Component importer
## This component handle the datasets import into the project
class Importer:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.fileHandlers = {
            ".csv": self.csvHandler,
        }
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

    # handle csv files read and import into a dataframe
    def csvHandler (self, file: any):
        df = pd.read_csv(file)
        dataframeHandler.saveDataframe(df)

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
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=Importer)
_v1.register_component(component)
