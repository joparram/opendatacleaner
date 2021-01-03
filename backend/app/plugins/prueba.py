import argparse
from ..api import _v1

class FooHandler:
    def __init__(self):
        print("llamada constructor")
    def __call__(self):
        print("Ejecución de FooHandler")

foo_command = _v1.Command("foo", FooHandler, FooHandler, lambda p: None)
_v1.register_command(foo_command)