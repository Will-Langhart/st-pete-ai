from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import openai
from transformers import pipeline
import os
from langchain.chat_models import ChatOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def __repr__(self):
        return f'<User {self.username}>'

@app.route('/')
def index():
    return render_template('index.html')

# Initialize Hugging Face pipeline (e.g., using GPT-2)
hf_pipeline = pipeline('text-generation', model='gpt2')

@app.route('/respond_with_langchain', methods=['POST'])
def respond_with_langchain():
    user_input = request.json.get('input')
    response = process_input_with_langchain(user_input)
    return jsonify({'response': response})

@app.route('/respond_with_huggingface', methods=['POST'])
def respond_with_huggingface():
    user_input = request.json.get('input')
    response = hf_pipeline(user_input, max_length=50, num_return_sequences=1)
    return jsonify({'response': response[0]['generated_text']})

def process_input_with_langchain(input_text):
    # Placeholder for LangChain integration
    return "Response from LangChain for: " + input_text

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
