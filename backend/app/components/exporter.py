import pymongo
from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
import numpy as np
from app.components._data import dataframeHandler
import json
from io import StringIO, BytesIO

# id del componente
componentId = "exporter"
# Nombre del componente
componentName = "Exporter"
# Descripción del componente
componentDescription = "exportar datos a base de datos..."
# Nombre de la opción en la interfaz
componentInterfaceName = "Exportar..."
# Acciones que puede realizar el componente y parámetros que genera la interfaz
Actions = [_v1.Action(
                      name="csv",
                      description="acción por defecto",
                      params=[
                          _v1.Param(name="filename", kind="string"),
                      ])
          ]
## Component importer
## This component handle the datasets import into the project
class Exporter:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "csv": self.csvHandler,
        }
        self.pagination = {
            "startRow": None,
            "endRow": None,
        }
        self.filedata = { 'file': None, 'mimetype': 'text/csv', 'filename': 'dataframe.csv' }

    # Update pagination params from request
    def _updatePagination (self, request: any):
        startRowParam = request.args.get('startRow')
        endRowParam = request.args.get('endRow')
        self.pagination["startRow"] = None if startRowParam is None else int(startRowParam)
        self.pagination["endRow"]= None if endRowParam is None else int(endRowParam)


    # default application handle which allow to import files though file handlers
    def csvHandler(self, request):
        df = dataframeHandler.getDataframe()

        filename = request.form.get('filename')
        filebuffer = StringIO()
        df.to_csv(filebuffer, index=False)
        filemem = BytesIO()
        filemem.write(filebuffer.getvalue().encode())
        filemem.seek(0)
        filebuffer.close()
        self.filedata['file'] = filemem
        self.filedata['mimetype'] = 'text/csv'
        self.filedata['filename'] = filename

    # call function triggered
    def __call__(self, request: any):
        self._updatePagination(request)
        action = request.args.get("action")
        print("accion: ", action)
        if action is None:
            self.actions["default"](request)
        elif action not in self.actions:
            raise Error('Accion {} desconocida'.format(action))
        else:
            self.actions[action](request)
        return self.filedata

# component registration in the internal api
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=Exporter)
_v1.register_component(component)
