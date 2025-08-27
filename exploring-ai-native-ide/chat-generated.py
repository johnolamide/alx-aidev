from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class Item(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

# In-memory storage for items
items = []

@app.get("/items", response_model=List[Item])
def read_items():
    """Get all items"""
    return items

@app.post("/items", response_model=Item)
def create_item(item: Item):
    """Create a new item"""
    items.append(item)
    return item

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
