from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
from app.components._data import dataframeHandler

# Nombre del componente
componentName = "Importer"
# Descripción del componente
componentDescription = "Importar datos al proyecto"
# Nombre de la opción en la interfaz
componentInterfaceName = "Importar..."
# Acciones que puede realizar el componente y parámetros que genera la interfaz
Actions = [_v1.Action(name="default", 
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
        df = dataframeHandler.getDataframe()
        types = dataframeHandler.getColumnsTypes()
        return {"data": df.to_dict('records'), "types": types}
    # call function triggered
    def __call__(self, request: any):
        file = request.files['file']
        action = request.args.get("action")
        if action is None:
            result = self.actions["default"](file)
        elif action not in self.actions:
            raise Error('Accion {} desconocida'.format(action))
        else:
            result = self.actions[action](file)
        return result
# component registration in the internal api
component = _v1.Component(componentName, componentDescription, componentInterfaceName, Actions, Importer)
_v1.register_component(component)