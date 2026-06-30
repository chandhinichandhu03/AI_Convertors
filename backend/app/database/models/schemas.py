from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    user: Dict[str, Any]

class SettingsUpdate(BaseModel):
    theme: Optional[str] = "dark"
    language: Optional[str] = "en"
    notifications: Optional[bool] = True

class ConvertRequest(BaseModel):
    fileId: str
    targetFormat: str
    options: Optional[Dict[str, Any]] = None

class OcrRequest(BaseModel):
    fileId: str

class TranslateRequest(BaseModel):
    text: str
    fromLanguage: str
    toLanguage: str

class SummarizeRequest(BaseModel):
    text: str

class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "llama3"
    chatHistory: Optional[List[Dict[str, str]]] = []
    fileId: Optional[str] = None

# --- Resume and Career Suite Schemas ---

class ResumeCheckRequest(BaseModel):
    fileId: str
    model: Optional[str] = "llama3"

class ResumeMatchRequest(BaseModel):
    fileId: str
    jdText: str
    model: Optional[str] = "llama3"

class BulletRewriteRequest(BaseModel):
    bullets: List[str]
    model: Optional[str] = "llama3"

class KeywordOptimizeRequest(BaseModel):
    resumeText: str
    model: Optional[str] = "llama3"

class SectionGenerateRequest(BaseModel):
    sectionName: str
    resumeText: str
    metadata: Optional[Dict[str, Any]] = None
    model: Optional[str] = "llama3"

class GrammarCheckRequest(BaseModel):
    text: str
    model: Optional[str] = "llama3"

class CoverLetterRequest(BaseModel):
    fileId: str
    jdText: str
    model: Optional[str] = "llama3"

class SkillGapRequest(BaseModel):
    fileId: str
    track: str
    model: Optional[str] = "llama3"

class CareerRecommendRequest(BaseModel):
    fileId: str
    model: Optional[str] = "llama3"

class PortfolioAnalyzeRequest(BaseModel):
    fileId: str
    model: Optional[str] = "llama3"

class AskKbRequest(BaseModel):
    query: str
    model: Optional[str] = "llama3"

# --- Advanced Grammar & Language Suite Schemas ---

class GrammarAnalyzeRequest(BaseModel):
    text: str
    model: Optional[str] = "llama3"

class GrammarConvertRequest(BaseModel):
    text: str
    operation: str
    model: Optional[str] = "llama3"


# --- Advanced Calculator & Programming Compiler Schemas ---

class CodeConvertRequest(BaseModel):
    code: str
    source_lang: str
    target_lang: str
    model: Optional[str] = "llama3"

class SqlQueryRequest(BaseModel):
    query: str
    dbFrom: str
    dbTo: str
    model: Optional[str] = "llama3"

class SqlOptimizeRequest(BaseModel):
    query: str
    dbType: str
    model: Optional[str] = "llama3"

class MathSolveRequest(BaseModel):
    problemType: str
    data: Dict[str, Any]

class ScienceSolveRequest(BaseModel):
    problemType: str
    category: str
    data: Dict[str, Any]

class UnitConvertRequest(BaseModel):
    value: Any
    category: str
    unitFrom: str
    unitTo: str


class LanguageConvertRequest(BaseModel):
    text: str
    operation: str
    params: Optional[Dict[str, Any]] = None
    model: Optional[str] = "llama3"

class DataCleanRequest(BaseModel):
    fileId: str
    options: Optional[Dict[str, Any]] = None

class MediaExtractRequest(BaseModel):
    fileId: str
    extractType: str
