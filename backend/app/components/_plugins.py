import typing
from ..plugin import ImporterPlugin
from ..plugin import ExporterPlugin
from ..plugin import DatabaseExporterPlugin
from ..plugin import ProcessorPlugin
from ..plugin import DataPlugin
from ..plugin import TransformPlugin

ImporterPlugins = typing.List[ImporterPlugin]
ExporterPlugins = typing.List[ExporterPlugin]
DatabaseExporterPlugins = typing.List[DatabaseExporterPlugin]
ProcessorPlugins = typing.List[ProcessorPlugin]
DataPlugins = typing.List[DataPlugin]
TransformPlugins = typing.List[TransformPlugin]