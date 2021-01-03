class Error(Exception):
    def __init__(self, message, status=500, payload=None):
        self.message = message
        self.status = status
        self.payload = payload