from fpdf import FPDF

def save_text_as_pdf(text: str, filename: str = "output.pdf"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Arial", size=12)

    # Add each line separately to handle line breaks
    for line in text.split('\n'):
        pdf.multi_cell(0, 10, line)

    pdf.output(filename)
