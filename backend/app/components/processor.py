from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
from app.components._data import dataframeHandler
import numpy as np
from sklearn.impute import KNNImputer
from sklearn import preprocessing
from scipy.stats import zscore

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
                      name="averageImputing",
                      description="Imputación de datos faltantes en base a la media de la columna",
                      params=[
                      ]),
            _v1.Action(
                      name="mostFrecuencyImputing",
                      description="Imputación de datos faltantes en base al valor más frecuente",
                      params=[

                      ]),
            _v1.Action(
                      name="interpolationImputing",
                      description="Imputación de datos faltantes utilizando una interpolación",
                      params=[
                        _v1.Param(name="method", kind="select", options=["polynomial", 'linear', 'time', 'index', 'values', 'nearest', 'zero', 'slinear', 'quadratic', 'cubic', 'barycentric', 'krogh', 'spline']),
                        _v1.Param(name="order", kind="number"),
                      ]),
            _v1.Action(
                      name="kNearestNeighborsImputing",
                      description="Imputación de datos faltantes por vecindad",
                      params=[
                        _v1.Param(name="n_neighbors", kind="number"),
                      ]),
            _v1.Action(
                      name="interquartileOutlierRemoval",
                      description="Eliminar datos datos atípicos usando el rango de intercuartiles",
                      params=[
                      ]),
            _v1.Action(
                      name="zscoreOutlierRemoval",
                      description="Eliminar datos datos atípicos usando el zscore",
                      params=[
                      ])
          ]
## Component processor
## This component handle the datasets import into the project
class Processor:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "default": self.defaultHandler,
            "averageImputing": self.averageImputingHandler,
            "mostFrecuencyImputing": self.mostFrecuencyImputingHandler,
            "interpolationImputing": self.interpolationImputingHandler,
            "kNearestNeighborsImputing": self.kNearestNeighborsImputingHandler,
            "interquartileOutlierRemoval": self.interquartileOutlierRemovalHandler,
            "zscoreOutlierRemoval": self.zscoreOutlierRemovalHandler
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
    def defaultHandler(self, request):
        pass

    def averageImputingHandler(self, request):
        df = dataframeHandler.getDataframe()
        column = request.form.get('column')
        print("column: ", column)
        df[[column]] = df[[column]].fillna(df.mean(axis=0))
        pd.set_option("max_columns", None) # show all cols
        dataframeHandler.saveDataframe(df)

    def mostFrecuencyImputingHandler(self, request):
        print("mostFrecuencyImputingHandler")
        df = dataframeHandler.getDataframe()
        column = request.form.get('column')
        df[[column]] = df[[column]].fillna(df[[column]].mode().iloc[0])
        pd.set_option("max_columns", None) # show all cols
        dataframeHandler.saveDataframe(df)

    def interquartileOutlierRemovalHandler(self, request):
        print("interquartileOutlierRemovalHandler")
        df = dataframeHandler.getDataframe()
        column = request.form.get('column')
        Q1 = df[[column]].quantile(0.25)
        Q3 = df[[column]].quantile(0.75)
        IQR = Q3 - Q1
        print("IQR: ", IQR)
        print("Q1: ", Q1)
        print("Q3: ", Q3)
        pd.set_option("max_columns", None) # show all cols
        df = df[~((df[[column]] < (Q1 - 1.5 * IQR)) | (df[[column]] > (Q3 + 1.5 * IQR))).any(axis=1)]
        df.reset_index(drop=True, inplace=True)
        dataframeHandler.saveDataframe(df)


    def zscoreOutlierRemovalHandler(self, request):
        print("zscoreOutlierRemovalHandler")
        df = dataframeHandler.getDataframe()
        column = request.form.get('column')
        pd.set_option("max_columns", None) # show all cols
        print(zscore(df[[column]]))
        df = df[~((df[[column]] < (df[[column]].mean() - 3 * df[[column]].std())) | (df[[column]] > (df[[column]].mean() + 3 * df[[column]].std()))).any(axis=1)]
        df.reset_index(drop=True, inplace=True)
        dataframeHandler.saveDataframe(df)

    def interpolationImputingHandler(self, request):
        df = dataframeHandler.getDataframe()
        column = request.form.get('column')
        method = request.form.get('method')
        order = request.form.get('order')
        # df = df.interpolate(method='polynomial', order=2, axis=0)
        df[[column]] = df[[column]].interpolate(method=method, order=int(order), axis=0)
        print(df)
        pd.set_option("max_columns", None) # show all cols
        dataframeHandler.saveDataframe(df)

    def kNearestNeighborsImputingHandler(self, request):
        df = dataframeHandler.getDataframe()
        column = request.form.get('column')
        n_neighbors = request.form.get('n_neighbors')
        encoders = dict()
        df_copy = df.copy()
        for col_name in df_copy.columns:
            print(col_name, df_copy[col_name].dtype)
            if (df_copy[col_name].dtype == "object" or df_copy[col_name].dtype == "string"):
              series = df_copy[col_name]
              label_encoder = preprocessing.LabelEncoder()
              df_copy[col_name] = pd.Series(
                  label_encoder.fit_transform(series[series.notnull()]),
                  index=series[series.notnull()].index
              )
              encoders[col_name] = label_encoder
            else:
              print("Column", col_name, "not encoded")
        imputer = KNNImputer(n_neighbors=int(n_neighbors))
        imputedData = imputer.fit_transform(df_copy)
        imputed_dataframe = pd.DataFrame(imputedData, columns=df_copy.columns)
        if(df[column].dtype == "object" or df[column].dtype == "string"):
            imputed_dataframe[[column]] = imputed_dataframe[[column]].astype(int)
            decodedData = encoders[column].inverse_transform(imputed_dataframe[[column]])
            imputed_dataframe[column] = decodedData.ravel('C').tolist()
        df[[column]] = imputed_dataframe[[column]]
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
component = _v1.Component(name=componentName, description=componentDescription, interfacename=componentInterfaceName, actions=Actions, handler_class=Processor)
_v1.register_component(component)
