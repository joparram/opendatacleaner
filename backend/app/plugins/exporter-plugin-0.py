from ..api import _v1

class ExporterPluginTest:
    def __init__(self):
        print("llamada constructor de ExporterPluginTest ")
    def __call__(self):
        print("Ejecución de ExporterPluginTest")


exporterplugin = _v1.ExporterPlugin("exampleExporterPlugin", ExporterPluginTest, ExporterPluginTest, lambda p: None)
_v1.register_exporter_plugin(exporterplugin)