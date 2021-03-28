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
                          _v1.Param(name="value", kind="number"),
                      ]),
            _v1.Action(
                      name="setType",
                      description="Transforma una columna a un tipo concreto",
                      params=[
                          _v1.Param(name="type", options=["object", "int64", "float64", "bool", "datetime64[ns]"], kind="select"),
                      ]),
            _v1.Action(
                      name="deleteRow",
                      description="Transforma una columna a un tipo concreto",
                      params=[
                      ]),
            _v1.Action(
                      name="deleteColumn",
                      description="Transforma una columna a un tipo concreto",
                      params=[
                      ])
          ]
## Component importer
## This component handle the datasets import into the project
class Data:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "setType": self.setTypeHandler,
            "updateCell": self.updateCellHandler,
            "deleteRow": self.deleteRowHandler,
            "deleteColumn": self.deleteColumnHandler,
        }
        self.typesHandlers = {
            "float64": self.setTypeFloatHandler,
            "int64": self.setTypeIntHandler
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

    def setTypeHandler(self, request):
        _type = request.form.get('type')
        if _type in self.typesHandlers:
            self.typesHandlers[_type](request)
        else:
            column = request.form.get('column')
            df = dataframeHandler.getDataframe()
            df[[column]] = df[[column]].astype(_type)
            dataframeHandler.saveDataframe(df)

    def deleteRowHandler(self, request):
        row = int(request.form.get('row'))
        df = dataframeHandler.getDataframe()
        df = df.drop(row)
        df = df.reset_index(drop=True)
        dataframeHandler.saveDataframe(df)

    def deleteColumnHandler(self, request):
        column = request.form.get('column')
        df = dataframeHandler.getDataframe()
        df.drop(column, axis=1, inplace=True)
        dataframeHandler.saveDataframe(df)

    def setTypeFloatHandler(self, request):
        column = request.form.get('column')
        df = dataframeHandler.getDataframe()
        df[column] = pd.to_numeric(df[column], errors='coerce')
        dataframeHandler.saveDataframe(df)

    def setTypeIntHandler(self, request):
        column = request.form.get('column')
        df = dataframeHandler.getDataframe()
        df[column] = pd.to_numeric(df[column], errors='coerce')
        dataframeHandler.saveDataframe(df)

    def updateCellHandler(self, request):
        column = request.form.get('column')
        row = int(request.form.get('row'))
        value = request.form.get('value')
        if not value or value.isspace():
          value = None
        df = dataframeHandler.getDataframe()
        pd.set_option("max_columns", None) # show all cols
        df.at[row, column] = value
        dataframeHandler.saveDataframe(df)

    # call function triggered
    def __call__(self, request: any):
        self._updatePagination(request)
        action = request.args.get("action")
        print("accion: ", action)
        if action is None:
            raise Error('No se ha seleccionado una acción')
        elif action not in self.actions:
            raise Error('Accion {} desconocida'.format(action))
        else:
            self.actions[action](request)
        return dataframeHandler.getAllData(self.pagination)

# component registration in the internal api
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=Data)
_v1.register_component(component)
