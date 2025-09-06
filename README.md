<img width="1024" height="1024" alt="banner" src="https://github.com/user-attachments/assets/fe8efa46-45b7-4128-8b06-993e74399fb0" />
# Banana Split Stories 🍌
A web-based, D&D-style generative adventure game. "Banana Split Stories" allows a user to co-create a unique, cinematic story by making choices that dynamically generate the visual and auditory world around them.

<!-- TODO: Add a GIF of the final application in action! -->

## ✨ Project Overview
This project is a submission for the [Nano Banana Hackathon](https://www.kaggle.com/competitions/banana/overview), utilizing the new Gemini 2.5 Flash Image Preview ("Nano Banana") API.

The core idea is to create a deeply personal and immersive storytelling experience. Users can cast themselves as the main character of a fantasy adventure by uploading a selfie. Our application then generates a visually consistent hero and crafts a rich, branching narrative with atmospheric audio, all in real-time based on the player's choices.

### Core Technologies
Frontend: React

Backend: Python with FastAPI

AI Image Generation: Google Gemini 2.5 Flash Image Preview

AI Audio Generation: ElevenLabs API (Planned)

## 🚀 Getting Started
Follow these instructions to set up and run the project locally.

### Prerequisites
Python 3.8+

Node.js v18+ and npm

A Google AI API Key. You can get one from Google AI Studio.

### Installation & Setup
1. Clone the repository:

```bash
git clone <your-repo-url>
cd banana-split-stories
```

2. Set up environment variables:
Create a new file named `.env` in the root of the project directory. This file will hold your secret API keys. Copy the contents of `.env.example` (you will create this file) and add your key.

`.env.example` file:

```bash
GEMINI_API_KEY="YOUR_API_KEY_HERE"
ELEVENLABS_API_KEY="YOUR_API_KEY_HERE"
```

Your .env file should look like this:

```bash
GEMINI_API_KEY="aIzaSy...xxxxxxxxxxxx"
```

3. Install backend dependencies:

```bash
pip install -r api/requirements.txt
```

4. Install frontend dependencies:

```bash
cd frontend
npm install
```

## 🏃 Running the Application
We have two primary ways to run the application.

### A) Development Mode (Recommended for Hacking)
This method runs the frontend and backend as separate processes, allowing for hot-reloading and faster development.

Start the Backend API:
Open a terminal, navigate to the /api directory, and run:

```bash
cd api
uvicorn main:app --reload
```

Your API will be running on http://localhost:8000.

Start the Frontend App:
Open a second terminal, navigate to the /frontend directory, and run:

```bash
cd frontend
npm start
```

Your React application will open in your browser at http://localhost:3000.

### B) Production-like Mode (For Final Testing/Judges)
This method builds the frontend and serves it directly from the FastAPI backend, simulating a production environment. A single script will handle everything.

*(This will be finalized with the `start.sh` script we designed).

📂 Project Structure
A brief overview of the key directories:
```bash

/
├── api/                # Contains the Python FastAPI backend code
│   └── main.py         # Main API application file
├── frontend/           # Contains the Create React App frontend
│   └── src/            # Main source code for the React app
├── notebooks/          # Jupyter notebooks for API experimentation
└── README.md           # You are here!
```

## 🗺️ Roadmap & Future Work
While the core focus of the hackathon is the MVP, here is the future vision for Banana Split Stories:

[ ] Version 1 (MVP): A functional 3-step dynamic adventure with branching choices, selfie-to-character generation, and AI-powered visuals and audio.

[ ] Version 2 (Dice Mechanics): Introduce a dice roll system for skill checks and choice outcomes to enhance the "game" feel.

[ ] Version 3 (Video Generation): Evolve the experience from static images to short, animated clips using generative video models.

[ ] Version 4 (Multi-player): Transform the solo adventure into a collaborative, multi-player campaign.
