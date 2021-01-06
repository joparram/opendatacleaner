import argparse
from dataclasses import dataclass
from app.action import Action
from typing import Callable

@dataclass
class Component:
    name: str
    description: str
    actions: [Action]
    handler_class: Callable[..., Callable[[None], None]]