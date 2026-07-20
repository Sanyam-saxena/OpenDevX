import logging

from app.core.settings import Settings


def configure_logging(settings: Settings) -> None:
    """Configure the application root logger for the active environment."""
    level = logging.DEBUG if settings.environment == "development" else logging.INFO
    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    if root_logger.handlers:
        return

    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s")
    )
    root_logger.addHandler(handler)


def get_logger(name: str) -> logging.Logger:
    """Return a named application logger."""
    return logging.getLogger(name)
