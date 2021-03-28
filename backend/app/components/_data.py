from ..api import _v1
from flask_jsonpify import jsonify
from flask import abort
from pathlib import Path
from app.error import Error
import pandas as pd
import numpy as np
import time
import sys
import os
from urllib.request import urlopen
import urllib.parse as parse
import ssl
from werkzeug.datastructures import FileStorage
import requests
from io import StringIO
import stringcase
import re

class dataframeHandler:

    @staticmethod
    def fixHeaders(df):
        columnsraw = list(df.columns)
        columns = [re.sub('[^0-9a-zA-Z]+', '', i) for i in columnsraw]
        columns = [stringcase.camelcase(i) for i in columns]
        return columns

    @staticmethod
    def saveDataframe(df):
        columns = dataframeHandler.fixHeaders(df)
        df.columns = columns
        # transform empty string to nan
        df = df.replace(r'^\s+$', np.nan, regex=True)
        df.to_feather("cached")

    @staticmethod
    def getDataframe():
        return pd.read_feather("cached")

    @staticmethod
    def getColumnsTypes():
        df = dataframeHandler.getDataframe()
        return df.dtypes.apply(lambda x: x.name).to_dict()

    @staticmethod
    def getColumnsNames():
        df = dataframeHandler.getDataframe()
        columnsraw = list(df.columns)
        columns = []
        for column in columnsraw:
            columns.append(dict (headerName=column, field=column))
        return columns

    @staticmethod
    def getAllData(pagination = {}):
        df = dataframeHandler.getDataframe()
        columnsraw = list(df.columns)
        columns = []
        data = {}
        # Fix json format
        for column in columnsraw:
            columns.append(dict (headerName=column, field=column))
        if "startRow" in pagination and "endRow" in pagination:
            if pagination["startRow"] != None and pagination["endRow"] != None:
                data = df.iloc[pagination["startRow"]:pagination["endRow"]].replace({np.nan:None}).to_dict('records')
        else:
            data = df.replace({np.nan:None}).to_dict('records')
        return dict (data=data, types=df.dtypes.apply(lambda x: x.name).to_dict(), columns=columns)
