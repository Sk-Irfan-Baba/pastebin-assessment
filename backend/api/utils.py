from datetime import datetime, timezone
import os

def get_effective_now(test_now_ms: str | None) -> datetime:
    # Rule: Only use the header if TEST_MODE is '1'
    if os.getenv("TEST_MODE") == "1" and test_now_ms:
        # Convert milliseconds from header to a datetime object
        return datetime.fromtimestamp(int(test_now_ms) / 1000.0, tz=timezone.utc)
    return datetime.now(timezone.utc)