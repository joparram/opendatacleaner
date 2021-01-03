import argparse
from ..api import _v1

class ImporterPluginTest:
    def __init__(self):
        print("llamada constructor ImporterPluginTest")
    def __call__(self, request: any):
        print("Ejecución de ImporterPluginTest")

importerplugin = _v1.ImporterPlugin("foo", ImporterPluginTest, ImporterPluginTest, lambda p: None)
_v1.register_importer_plugin(importerplugin) 