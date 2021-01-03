import sys
from typing import Any, Type
from ...plugin import ExporterPlugin, ImporterPlugin, DatasetProcessorPlugin, DatabaseExporterPlugin
from ...component import Component
from ...components._plugins import ImporterPlugins, ExporterPlugins, DatabaseExporterPlugins, DatasetProcessorPlugins
from ...components._components import Components
import cargo

def create_container():
    _container = cargo.containers.Standard()
    _container[ImporterPlugins] = []
    _container[ExporterPlugins] = []
    _container[DatabaseExporterPlugins] = []
    _container[DatasetProcessorPlugins] = []
    _container[Components] = []
    return _container

def register_importer_plugin(plugin: ImporterPlugin):
    container[ImporterPlugins].append(plugin)
    container[plugin.handler_class] = plugin.handler_class

def register_exporter_plugin(plugin: ExporterPlugin):
    container[ExporterPlugins].append(plugin)
    container[plugin.handler_class] = plugin.handler_class

def register_dataset_processor_plugin(plugin: DatasetProcessorPlugin):
    container[DatasetProcessorPlugins].append(plugin)
    container[plugin.handler_class] = plugin.handler_class

def register_database_exporter_plugin(plugin: DatabaseExporterPlugin):
    container[DatabaseExporterPlugins].append(plugin)
    container[plugin.handler_class] = plugin.handler_class

def register_component(component: Component):
    print("registro de componente: "+component.name)
    container[Components].append(component)
    container[component.handler_class] = component.handler_class

container = create_container()