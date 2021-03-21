import pymongo
from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
import numpy as np
from app.components._data import dataframeHandler
import json

# id del componente
componentId = "databaseExporter"
# Nombre del componente
componentName = "DatabaseExporter"
# Descripción del componente
componentDescription = "exportar datos a base de datos..."
# Nombre de la opción en la interfaz
componentInterfaceName = "Exportar..."
# Acciones que puede realizar el componente y parámetros que genera la interfaz
Actions = [_v1.Action(
                      name="mongodb",
                      description="acción por defecto",
                      params=[
                          _v1.Param(name="connectionString", kind="string", default="mongodb://localhost:27017/"),
                          _v1.Param(name="database", kind="string"),
                          _v1.Param(name="collection", kind="string"),
                      ])
          ]
## Component importer
## This component handle the datasets import into the project
class DatabaseExporter:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "mongodb": self.mongodbHandler,
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
    def mongodbHandler(self, request):
        df = dataframeHandler.getDataframe()
        connectionString = request.form.get('connectionString')
        database_name = request.form.get('database')
        collection_name = request.form.get('collection')

        client = pymongo.MongoClient(connectionString)
        database = client[database_name]
        collection = database[collection_name]
        collection.insert_many(df.to_dict('records'))


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
        return dataframeHandler.getAllData(self.pagination)

# component registration in the internal api
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=DatabaseExporter)
_v1.register_component(component)
