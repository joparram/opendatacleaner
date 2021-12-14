import sys
from typing import Any, Type
from ...plugin import ExporterPlugin, ImporterPlugin, ProcessorPlugin, DatabaseExporterPlugin, DataPlugin
from ...component import Component
from ...components._plugins import ImporterPlugins, ExporterPlugins, DatabaseExporterPlugins, ProcessorPlugins, DataPlugins
from ...components._components import Components
import cargo

def create_container():
    _container = cargo.containers.Standard()
    _container[ImporterPlugins] = []
    _container[ExporterPlugins] = []
    _container[DatabaseExporterPlugins] = []
    _container[ProcessorPlugins] = []
    _container[DataPlugins] = []
    _container[Components] = []
    return _container

def register_importer_plugin(plugin: ImporterPlugin):
    container[ImporterPlugins].append(plugin)
    container[plugin.handler_class] = plugin.handler_class

def register_exporter_plugin(plugin: ExporterPlugin):
    container[ExporterPlugins].append(plugin)
    container[plugin.handler_class] = plugin.handler_class

def register_processor_plugin(plugin: ProcessorPlugin):
    container[ProcessorPlugins].append(plugin)
    container[plugin.handler_class] = plugin.handler_class

def register_database_exporter_plugin(plugin: DatabaseExporterPlugin):
    container[DatabaseExporterPlugins].append(plugin)
    container[plugin.handler_class] = plugin.handler_class

def register_data_plugin(plugin: DataPlugin):
    container[DataPlugins].append(plugin)
    container[plugin.handler_class] = plugin.handler_class



def unregister_processor_plugin(pluginName):
    for i in container[ProcessorPlugins]:
        if i.name == pluginName:
            container[ProcessorPlugins].remove(i)
            print("unregister processor plugin: "+pluginName)
            break

def unregister_importer_plugin(pluginName):
    for i in container[ImporterPlugins]:
        if i.name == pluginName:
            plugin = container[ImporterPlugins]
            del container[i.handler_class]
            container[ImporterPlugins].remove(i)
            print("unregister importer plugin: "+pluginName)
            break

def unregister_exporter_plugin(pluginName):
    for i in container[ExporterPlugins]:
        if i.name == pluginName:
            container[ExporterPlugins].remove(i)
            print("unregister exporter plugin: "+pluginName)
            break
    

def unregister_database_exporter_plugin(pluginName):
    for i in container[DatabaseExporterPlugins]:
        if i.name == pluginName:
            container[DatabaseExporterPlugins].remove(i)
            print("unregister database exporter plugin: "+pluginName)
            break
    

def unregister_data_plugin(pluginName):
    for i in container[DataPlugins]:
        if i.name == pluginName:
            container[DataPlugins].remove(i)
            print("unregister data plugin: "+pluginName)
            break

def get_importer_plugins():
    return container[ImporterPlugins]
def get_exporter_plugins():
    return container[ExporterPlugins]
def get_processor_plugins():
    return container[ProcessorPlugins]
def get_database_exporter_plugins():
    return container[DatabaseExporterPlugins]
def get_data_plugins():
    return container[DataPlugins]

def register_component(component: Component):
    print("registro de componente: "+component.name)
    container[Components].append(component)
    container[component.handler_class] = component.handler_class




container = create_container()
