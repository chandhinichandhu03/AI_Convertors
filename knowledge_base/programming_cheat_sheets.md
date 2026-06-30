# Programming Syntax & Stack Cheat Sheets

Brief cheat sheets and syntax guides for languages and frameworks used in modern web applications.

## 1. React + TypeScript + Tailwind CSS Cheat Sheet
* **Component Typing**:
  ```tsx
  interface LayoutProps {
    children: React.ReactNode;
    theme?: 'light' | 'dark';
  }
  export default function Layout({ children, theme = 'dark' }: LayoutProps) {
    return <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>{children}</div>;
  }
  ```
* **Tailwind Transitions & Hover**:
  ```html
  <button class="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition-all duration-300 px-4 py-2 rounded-xl shadow-md shadow-indigo-500/10">
    Offline Action
  </button>
  ```
* **Framer Motion Transition Options**:
  ```tsx
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} />
  ```

## 2. FastAPI + SQLAlchemy Schema Reference
* **FastAPI Router Endpoint template**:
  ```python
  from fastapi import APIRouter, Depends, HTTPException
  from sqlalchemy.orm import Session
  
  router = APIRouter(prefix="/api/test")
  
  @router.post("/process")
  def process_endpoint(payload: CustomSchema, db: Session = Depends(get_db)):
      # DB transactions
      return {"status": "success"}
  ```
* **SQLAlchemy Model Setup**:
  ```python
  class Item(Base):
      __tablename__ = "items"
      id = Column(Integer, primary_key=True, index=True)
      name = Column(String, index=True)
      owner_id = Column(Integer, ForeignKey("users.id"))
  ```

## 3. SQL Database Queries
* **Index Creation**: `CREATE INDEX idx_user_history ON conversion_history(user_id, created_at DESC);`
* **Common SQLite Joins**: `SELECT h.*, u.username FROM conversion_history h JOIN users u ON h.user_id = u.id;`
