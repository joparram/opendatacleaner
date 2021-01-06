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


componentName = "Importer"

class Importer:
    def __init__(self):
        self.fileHandlers = {
            ".csv": self.csvHandler,
        }
    
    def csvHandler (self, file: any):
        df = pd.read_csv(file)
        df.to_feather("cached")

    def getDataframe (self):
        return pd.read_feather("cached")
        
    def getColumnsTypes(self):
        df = self.getDataframe()
        return df.dtypes.apply(lambda x: x.name).to_dict()

    def getFileExtension (self, file):
        return Path(file.filename).suffix
        
    def handler(self, file):
        extension = self.getFileExtension(file)
        if extension not in self.fileHandlers:
            raise Error('Extensión {} no soportada'.format(extension))
        self.fileHandlers[extension](file)
        df = self.getDataframe()
        types = self.getColumnsTypes()
        return jsonify({"data": df.to_dict('records'), "types": types})
        
    def __call__(self, request: any):
        file = request.files['file']
        result = self.handler(file)
        return result

component = _v1.Component(componentName, Importer, None, Importer)
_v1.register_component(component)