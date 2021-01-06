from dataclasses import dataclass
from typing import Callable
from typing_extensions import Literal
@dataclass
class Param:
    kind: Literal['file', 'string', 'number', 'boolean']
    name: str
    description: str = ""
    required: bool = True

@dataclass
class Action:
    name: str
    description: str
    params: [Param]

