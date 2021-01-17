from ..api import _v1

# Nombre del plugin
pluginId = "importerPlugin"
# Nombre del plugin
pluginName = "ImporterPlugin"
# Descripción del plugin
pluginDescription = "Importar datos al proyecto de otra forma"
# Nombre de la opción en la interfaz
pluginInterfaceName = "Importar plugin 1..."
# Acciones que puede realizar el plugin y parámetros que genera la interfaz
Actions = [_v1.Action(
                      name="default",
                      description="acción por defecto", 
                      params=[
                          _v1.Param(name="file", kind="file"),
                      ]),
            _v1.Action(
                      name="importar xlsx",
                      description="acción por defecto", 
                      params=[
                          _v1.Param(name="confianza", kind="text"),
                          _v1.Param(name="file", kind="file"),
                           _v1.Param(name="destruir", kind="boolean"),
                      ])
          ]

class ImporterPluginTest:
    def __init__(self):
        print("llamada constructor de ImporterPluginTest ")
    def __call__(self, request):
        print("Ejecución de ImporterPluginTest")


# plugin registration in the internal api
plugin = _v1.ImporterPlugin(name=pluginName, description=pluginDescription, interfacename=pluginInterfaceName, actions=Actions, handler_class=ImporterPluginTest)
_v1.register_importer_plugin(plugin)
