from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
from app.components._data import dataframeHandler
import numpy as np
from sklearn.impute import KNNImputer
from sklearn import preprocessing
import re
# id del componente
componentId = "transform"
# Nombre del componente
componentName = "Transform"
# Descripción del componente
componentDescription = "Transformación de columnas"
# Nombre de la opción en la interfaz
componentInterfaceName = "Procesar..."
# Acciones que puede realizar el componente y parámetros que genera la interfaz
Actions = [_v1.Action(
                      name="createNewColumn",
                      description="Imputación de datos faltantes en base a la media de la columna",
                      params=[
                        _v1.Param(name="nombre", kind="string"),
                        _v1.Param(name="expresion", kind="string"),
                      ]),
            _v1.Action(
                      name="transformColumn",
                      description="Imputación de datos faltantes en base a la media de la columna",
                      params=[
                        _v1.Param(name="expresion", kind="string"),
                      ]),    
          ]
## Component transform
## This component handle the datasets import into the project
class Transform:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "default": self.defaultHandler,
            "createNewColumn": self.createNewColumnHandler,
            "transformColumn": self.transformColumnHandler,
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


    def columnTranslation (self, expresion: any):
        df = dataframeHandler.getDataframe()
        columns = list(df.columns)
        i=1
        for column in columns:
            expresion = re.sub(r"\b{}\b".format(f"c{i}"), column, expresion)
            i += 1
        return expresion

    def applyDataframeExpresion (self, expresion: any):
        df = dataframeHandler.getDataframe()
        expresion = self.columnTranslation(expresion)
        return df.eval(expresion)
        
    # default application handle which allow to import files though file handlers
    def defaultHandler(self, request):
        pass

    def createNewColumnHandler(self, request):
        df = dataframeHandler.getDataframe()
        nombre = request.form.get("nombre")
        columns = list(df.columns)
        expresion = request.form.get("expresion")
        if (nombre in columns):
            raise Error('El nombre de la columna ya existe')
        df[nombre] = self.applyDataframeExpresion(expresion)
        dataframeHandler.saveDataframe(df)

    def transformColumnHandler(self, request):
        df = dataframeHandler.getDataframe()
        expresion = request.form.get("expresion")
        column = request.form.get('column')
        print("expresion: ", expresion)
        print("column: ", column)
        df[column] = self.applyDataframeExpresion(expresion)
        dataframeHandler.saveDataframe(df)

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
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=Transform)
_v1.register_component(component)
