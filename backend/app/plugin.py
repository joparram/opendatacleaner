import argparse
from dataclasses import dataclass
from typing import Callable

@dataclass
class ExporterPlugin:
    name: str
    description: str
    handler_class: Callable[..., Callable[[None], None]]
    properties: [any]

@dataclass
class ImporterPlugin:
    name: str
    description: str
    handler_class: Callable[..., Callable[[None], None]]
    properties: [any]

@dataclass
class DatabaseExporterPlugin:
    name: str
    description: str
    handler_class: Callable[..., Callable[[None], None]]
    properties: [any]

@dataclass
class DatasetProcessorPlugin:
    name: str
    description: str
    handler_class: Callable[..., Callable[[None], None]]
    properties: [any]