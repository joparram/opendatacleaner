import typing
from ..plugin import ImporterPlugin
from ..plugin import ExporterPlugin
from ..plugin import DatabaseExporterPlugin
from ..plugin import DatasetProcessorPlugin

ImporterPlugins = typing.List[ImporterPlugin]
ExporterPlugins = typing.List[ExporterPlugin]
DatabaseExporterPlugins = typing.List[DatabaseExporterPlugin]
DatasetProcessorPlugins = typing.List[DatasetProcessorPlugin]