from flask import Flask, request, jsonify
import openai
from transformers import pipeline

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

# Initialize Hugging Face pipeline (e.g., using GPT-2)
hf_pipeline = pipeline('text-generation', model='gpt2')

@app.route('/respond_with_langchain', methods=['POST'])
def respond_with_langchain():
    # This is a placeholder function; you'll need to replace it with actual LangChain integration
    # Assume 'process_input_with_langchain' is a function you'll define for processing the input
    user_input = request.json.get('input')
    response = process_input_with_langchain(user_input)
    return jsonify({'response': response})

@app.route('/respond_with_huggingface', methods=['POST'])
def respond_with_huggingface():
    user_input = request.json.get('input')
    # Generate response using Hugging Face's pipeline
    response = hf_pipeline(user_input, max_length=50, num_return_sequences=1)
    return jsonify({'response': response[0]['generated_text']})

def process_input_with_langchain(input_text):
    # Placeholder for LangChain integration
    # You should replace this with actual code to use LangChain for generating a response
    return "Response from LangChain for: " + input_text

if __name__ == '__main__':
    app.run(debug=True)
