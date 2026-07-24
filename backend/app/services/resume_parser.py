import docx
import fitz  # PyMuPDF


def parse_resume(file_path: str, filename: str) -> str:
    """Extract raw text from an uploaded PDF or DOCX resume."""
    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        return _parse_pdf(file_path)
    if lower_name.endswith((".docx", ".doc")):
        return _parse_docx(file_path)
    raise ValueError("Only PDF or DOCX resumes are supported")


def _parse_pdf(file_path: str) -> str:
    text_parts = []
    with fitz.open(file_path) as doc:
        for page in doc:
            text_parts.append(page.get_text())
    return "\n".join(text_parts).strip()


def _parse_docx(file_path: str) -> str:
    document = docx.Document(file_path)
    return "\n".join(paragraph.text for paragraph in document.paragraphs).strip()
