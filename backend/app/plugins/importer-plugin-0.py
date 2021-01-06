from ..api import _v1

# Nombre del plugin
pluginName = "ImporterPlugin"
# Descripción del plugin
pluginDescription = "Importar datos al proyecto de otra forma"
# Nombre de la opción en la interfaz
pluginInterfaceName = "Importar plugin 1..."
# Acciones que puede realizar el plugin y parámetros que genera la interfaz
Actions = [_v1.Action(name="default", 
                      description="acción por defecto", 
                      params=[
                          _v1.Param(name="file", kind="file"),
                      ])
          ]

class ImporterPluginTest:
    def __init__(self):
        print("llamada constructor de ImporterPluginTest ")
    def __call__(self, request):
        print("Ejecución de ImporterPluginTest")


# plugin registration in the internal api
plugin = _v1.ImporterPlugin(pluginName, pluginDescription, pluginInterfaceName, Actions, ImporterPluginTest)
_v1.register_importer_plugin(plugin)