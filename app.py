from flask import Flask, request, jsonify, render_template, redirect, url_for, flash, send_from_directory, abort  # Core Flask framework and utilities for web application
from flask_sqlalchemy import SQLAlchemy  # Flask extension for SQLAlchemy ORM
from flask_login import LoginManager, login_user, logout_user, login_required, current_user #User Authentication Management
from flask_login import UserMixin
from flask import flash, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash  # Utilities for hashing and verifying passwords
from models import Interaction  # Adjust the import path based on your project structure
import openai # OpenAI API for GPT models
import asyncio
import aiohttp
import os  # Access environment variables and filesystem
import logging  # Logging library for tracking events and errors
from dotenv import load_dotenv  # Load environment variables from a .env file

# Load environment variables
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)  # Initialize Flask application
app.config['SECRET_KEY'] = os.getenv('secret_key')  # Configure secret key for sessions
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'  # Database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)  # Initialize SQLAlchemy

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'
        
# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User loader callback
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/add_user', methods=['POST'])
def add_user():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    # Check if the username or email already exists in the database
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        flash('Username already exists', 'error')
        return redirect(url_for('show_add_user_form'))

    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        flash('Email already exists', 'error')
        return redirect(url_for('show_add_user_form'))

    # Create a new user instance and add it to the database
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    flash('User successfully added', 'success')
    return redirect(url_for('dashboard'))
    
@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    # Find the user by email
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        # User not found or password incorrect
        flash('Invalid email or password', 'error')
        return redirect(url_for('auth'))

    # Log in the user
    login_user(user)

    return redirect(url_for('dashboard')) # Redirect to the dashboard after successful login

@app.route('/api/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    user_list = []
    for user in users:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
        user_list.append(user_data)
    return jsonify(user_list)
    
@app.route('/')  # Define route for homepage
def index():
    return render_template('index.html')

if __name__ == '__main__':
     app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
    }

llm = ChatOpenAI()
llm.invoke("Hello, world!")

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
