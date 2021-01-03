from flask_restful import Resource, Api
from flask import session, render_template, request, redirect, url_for
from flask_jsonpify import jsonify
import pandas as pd
import numpy as np
import time
import sys

class Processor(Resource):
    basket = ["holas"]
    
    def __init__(self):
        print("fin")

    def get(self):
        print("inicio")
        df = pd.read_feather("cached")
        print(df.memory_usage(index=True).sum(), flush=True)
        return df.to_dict('records')
    
    def post(self):
        df = pd.DataFrame(np.random.choice(['foo','bar','baz','bar','baz','bar','baz','bar','baz'], size=(1000000,10)))
        df.columns = df.columns.astype(str)
        df.to_feather("cached")
        print("buffered?")
        return {'status': 'new4'}

    def put(self):
        return {'status': 'put'}

    def patch(self):

        return {'status': 'patch'}

    def delete(self):

        return {'status': 'delete'}
