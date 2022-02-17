from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
from app.components._data import dataframeHandler
import matplotlib.pyplot as plt
import numpy as np
from sklearn.impute import KNNImputer
from sklearn import preprocessing
import re
# id del componente
componentId = "visualization"
# Nombre del componente
componentName = "Visualization"
# Descripción del componente
componentDescription = "Visualizationación de columnas"
# Nombre de la opción en la interfaz
componentInterfaceName = "Procesar..."
# Acciones que puede realizar el componente y parámetros que genera la interfaz
Actions = [_v1.Action(
                      name="clusterColumnValues",
                      description="Imputación de datos faltantes en base a la media de la columna",
                      params=[
                          _v1.Param(name="columnAlias", kind="string"),
                      ]),
          ]
## Component visualization
## This component handle the datasets import into the project
class Visualization:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "default": self.defaultHandler,
            "clusterColumnValues": self.clusterColumnValuesHandler,
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

    def clusterColumnValuesHandler(self, request: any):
        df = dataframeHandler.getDataframe()
        column = request.form.get('columnAlias')
        column = self.columnTranslation(column)
        print("start")
        plot = df[column].value_counts(dropna=False).plot(kind='bar')
        figure = plot.get_figure()
        figure.savefig("/tmp/plot.png", bbox_inches="tight")
        path = Path("/tmp/plot.png")
        # fig,ax=plt.subplots(figsize=(100,10))
        # for i in range(100): # my original depth_file has 11955 lines
        #     print(i)
        #     ax.plot(i+1, round(100*np.random.random()))
        # fig.tight_layout()
        # fig.savefig('/tmp/plot.png', dpi=600)

        return path
        
        
    # default application handle which allow to import files though file handlers
    def defaultHandler(self, request):
        pass

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
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=Visualization)
_v1.register_component(component)
