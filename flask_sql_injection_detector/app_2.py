from flask import Flask, request, jsonify, send_file
import numpy as np
from flask_cors import CORS
from model_loader import models, tokenizers, preprocess_query
import io
import bleach
import re
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

app = Flask(__name__)
CORS(app)

def is_safe_query(query):
    return bool(re.match(r'^[a-zA-Z0-9 ]*[;]*[.]*$', query)) 
 
@app.route("/", methods=["GET", "POST"])
def predict():
    try:
        data = request.json
        query = bleach.clean(data.get("query", "").strip())
        model_selected = data.get("model", "")

        if not query or not model_selected:
            return jsonify({"error": "Please provide a query and select a model."}), 400

        
        if is_safe_query(query):
            return jsonify({"prediction": "No SQL Injection"})

        tokenizer = tokenizers["dataset_1"] if "dataset_1" in model_selected else tokenizers["dataset_2"]
        processed_query = preprocess_query(query, tokenizer)

        model = models.get(model_selected)
        if model is None:
            return jsonify({"error": "Invalid model selected."}), 400

        pred = (model.predict(processed_query) > 0.5).astype(int).flatten()[0]
        prediction = "SQL Injection Detected" if pred == 1 else "No SQL Injection"

        return jsonify({"prediction": prediction})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate_pdf')
def generate_pdf():
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    title = Paragraph("SQL Injection Detection Report", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))

    result = request.args.get("result", "No result provided")
    prediction_text = Paragraph(f"<b>Prediction:</b> {result}", styles['Normal'])
    story.append(prediction_text)
    story.append(Spacer(1, 12))

    mod = request.args.get("model", "No model provided")
    model_text = Paragraph(f"<b>Model Used:</b> {mod}", styles['Normal'])
    story.append(model_text)
    story.append(Spacer(1, 12))

    query = request.args.get("query", "No query provided")
    query_text = Paragraph(f"<b>SQL Query:</b> {query}", styles['Normal'])
    story.append(query_text)
    story.append(Spacer(1, 12))

    doc.build(story)
    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name="SQL_Injection_Report.pdf", mimetype="application/pdf")

if __name__ == "__main__":
    app.run(debug=True)