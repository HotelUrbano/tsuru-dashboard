import os


TSURU_HOST = os.environ.get("TSURU_HOST", "http://localhost:8080")
TSURU_AUTO_USERNAME = os.environ.get("TSURU_AUTO_USERNAME", None)
TSURU_AUTO_PASSWORD = os.environ.get("TSURU_AUTO_PASSWORD", None)
