
import dataclasses, json

class _dataclassJsonEncoder(json.JSONEncoder):
        def default(self, o):
            nonSerializableHandler = lambda obj: f"<<non-serializable: {type(obj).__name__}>>"
            if dataclasses.is_dataclass(o):
                dc = dataclasses.asdict(o)
                return dataclasses.asdict(o)
            try:
                super().default(o)
            except:
                return nonSerializableHandler(o)
            return super().default(o)
        
def dataclassToJson(dc):
    return json.loads(json.dumps(dc, cls=_dataclassJsonEncoder))