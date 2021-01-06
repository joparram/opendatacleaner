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

class dataframeHandler:
    @staticmethod
    def saveDataframe(df):
        df.to_feather("cached")

    @staticmethod
    def getDataframe():
        return pd.read_feather("cached")

    @staticmethod
    def getColumnsTypes():
        df = dataframeHandler.getDataframe()
        return df.dtypes.apply(lambda x: x.name).to_dict()