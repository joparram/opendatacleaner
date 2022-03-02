from ..api import _v1
from pathlib import Path
from app.error import Error
import pandas as pd
from app.components._data import dataframeHandler
import matplotlib.pyplot as plt
import numpy as np
from sklearn.impute import KNNImputer
from sklearn import preprocessing
import seaborn as sns
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
                      name="barPlot",
                      description="Imputación de datos faltantes en base a la media de la columna",
                      params=[
                          _v1.Param(name="columnAlias", kind="string"),
                      ]),
          _v1.Action(
                      name="pairWiseScatterPlot",
                      description="Imputación de datos faltantes en base a la media de la columna",
                      params=[
                          _v1.Param(name="hueColumnAlias", kind="string"),
                      ]),
          _v1.Action(
                      name="boxPlot",
                      description="Imputación de datos faltantes en base a la media de la columna",
                      params=[
                          _v1.Param(name="columnAliasX", kind="string"),
                          _v1.Param(name="columnAliasY", kind="string"),
                      ])
          ]
## Component visualization
## This component handle the datasets import into the project
class Visualization:
    # constructor which initialize handlers and defined actions
    def __init__(self):
        self.actions = {
            "default": self.defaultHandler,
            "barPlot": self.barPlotHandler,
            "pairWiseScatterPlot": self.pairWiseScatterPlotHandler,
            "boxPlot": self.boxPlotHandler,
            "timeSeriesPlot": self.timeSeriesPlotHandler,
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


    def pairWiseScatterPlotHandler(self, request: any):
        df = dataframeHandler.getDataframe()
        column = request.form.get('hueColumnAlias')
        column = self.columnTranslation(column)
        print("start")
        figure = sns.pairplot(df, kind="scatter", hue=column, plot_kws=dict(s=80, edgecolor="white", linewidth=2.5))
        figure.savefig("/tmp/plot.png", bbox_inches="tight", transparent=True)
        path = Path("/tmp/plot.png")
        return path

    def boxPlotHandler(self, request: any):
        df = dataframeHandler.getDataframe()
        columnX = request.form.get('columnAliasX')
        columnX = self.columnTranslation(columnX)
        columnY = request.form.get('columnAliasY')
        columnY = self.columnTranslation(columnY)
        fig, ax = plt.subplots()
        figure = sns.boxplot(x=columnX, y=columnY, data=df, notch=False, ax=ax)
        plt.savefig("/tmp/plot.png", bbox_inches="tight", transparent=True)
        path = Path("/tmp/plot.png")
        return path

    def timeSeriesPlotHandler(self, request: any):
        df = dataframeHandler.getDataframe()
        columnX = request.form.get('columnAliasX')
        columnX = self.columnTranslation(columnX)
        columnY = request.form.get('columnAliasY')
        columnY = self.columnTranslation(columnY)
        plt.plot(columnX, columnY, data=df, color='tab:red')
        xtick_location = df.index.tolist()[::12]
        columnElements = df[columnX].tolist()
        xtick_labels = [x[-4:] for x in df[columnX].tolist()[::12]]
        plt.xticks(ticks=xtick_location, labels=xtick_labels, rotation=0, fontsize=12, horizontalalignment='center', alpha=.7)
        plt.yticks(fontsize=12, alpha=.7)
        plt.grid(axis='both', alpha=.3)
        # Remove borders
        plt.gca().spines["top"].set_alpha(0.0)
        plt.gca().spines["bottom"].set_alpha(0.3)
        plt.gca().spines["right"].set_alpha(0.0)
        plt.gca().spines["left"].set_alpha(0.3)
        plt.savefig("/tmp/plot.png", bbox_inches="tight", transparent=True)
        path = Path("/tmp/plot.png")
        return path

    def columnTranslation (self, expresion: any):
        df = dataframeHandler.getDataframe()
        columns = list(df.columns)
        i=1
        for column in columns:
            expresion = re.sub(r"\b{}\b".format(f"c{i}"), column, expresion)
            i += 1
        return expresion

    def barPlotHandler(self, request: any):
        df = dataframeHandler.getDataframe()
        column = request.form.get('columnAlias')
        column = self.columnTranslation(column)
        print("start")
        plot = df[column].value_counts(dropna=False).plot(kind='bar', alpha=0.7)
        figure = plot.get_figure()
        figure.savefig("/tmp/plot.png", bbox_inches="tight", transparent=True)
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
