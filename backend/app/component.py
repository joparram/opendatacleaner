import argparse
from dataclasses import dataclass
from typing import Callable

@dataclass
class Component:
    name: str
    description: str
    handler_class: Callable[..., Callable[[None], None]]