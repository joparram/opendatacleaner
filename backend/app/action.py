from dataclasses import dataclass
from typing import Callable

@dataclass
class Param:
    name: str
    required: bool

@dataclass
class Action:
    name: str
    description: str
    params: [Param]

