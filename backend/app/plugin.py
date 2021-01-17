from dataclasses import dataclass
from app.action import Action
from typing import Callable
import uuid

@dataclass
class ExporterPlugin:
    name: str
    description: str
    interfacename: str
    actions: [Action]
    handler_class: Callable[..., Callable[[None], None]]
    id: str = uuid.uuid4().hex

@dataclass
class ImporterPlugin:
    name: str
    description: str
    interfacename: str
    actions: [Action]
    handler_class: Callable[..., Callable[[None], None]]
    id: str = uuid.uuid4().hex

@dataclass
class DatabaseExporterPlugin:
    name: str
    description: str
    interfacename: str
    actions: [Action]
    handler_class: Callable[..., Callable[[None], None]]
    id: str = uuid.uuid4().hex

@dataclass
class DatasetProcessorPlugin:
    name: str
    description: str
    interfacename: str
    actions: [Action]
    handler_class: Callable[..., Callable[[None], None]]
    id: str = uuid.uuid4().hex