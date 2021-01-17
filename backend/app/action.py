from dataclasses import dataclass
from typing import Callable
from typing_extensions import Literal
import uuid

@dataclass
class Param:
    kind: Literal['file', 'string', 'number', 'boolean']
    name: str
    description: str = ""
    required: bool = True
    id: str = uuid.uuid4().hex

@dataclass
class Action:
    name: str
    description: str
    params: [Param]
    id: str = uuid.uuid4().hex