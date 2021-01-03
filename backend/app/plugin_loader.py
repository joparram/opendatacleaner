import app.plugins
import importlib
import pkgutil
import sys

def iter_namespace(ns_pkg):
    return pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + ".")

def load_plugins():
    for _, name, _ in iter_namespace(app.plugins):
        print(name)
        importlib.import_module(name)