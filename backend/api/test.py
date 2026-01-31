import os
from dotenv import load_dotenv
from sqlmodel import create_engine, SQLModel

# 1. Load the variables first!
load_dotenv()

# 2. Now fetch the variable
DATABASE_URL = os.getenv("DATABASE_URL")

# 3. Add a check to catch the error gracefully
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Check your .env file location!")

# 4. Finally, create the engine
print(DATABASE_URL)