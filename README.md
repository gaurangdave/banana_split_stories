<p align="center">
  <img width="1024" height="auto" alt="Banana Split Stories Banner" src="https://github.com/user-attachments/assets/fe8efa46-45b7-4128-8b06-993e74399fb0">
</p>

# Banana Split Stories 🍌

**A web-based, D&D-style generative adventure game where you become the hero.** "Banana Split Stories" co-creates a unique, cinematic story by making choices that dynamically generate the visual and auditory world around you.

---

### 🚀 [**Live Demo**](https://banana-split-stories-demo-5ce6a38b40e0.herokuapp.com/) 🚀

*(Note: As this is a free Heroku deployment, the application may take 15-30 seconds to wake up on the first visit.)*

### 📷 Screen Shots 📷

#### One Face, Many Worlds
*A gallery of heroes generated from a single selfie across all four themes, showcasing the power of Gemini 2.5 Flash.*

<p align="center">
<img alt="character_sheet" src="https://github.com/user-attachments/assets/00e44a6a-796b-4986-950a-0945acf0fb37" height="250" style="margin: 0 10px; border-radius: 8px;" />
<img  alt="character_sheet" src="https://github.com/user-attachments/assets/badead37-462e-4e3e-ada4-465fc73d6c02" height="250" style="margin: 0 10px; border-radius: 8px;"/>
<img  alt="character_sheet" src="https://github.com/user-attachments/assets/3aab8672-4afd-4897-9e39-498c5b480da4" height="250" style="margin: 0 10px; border-radius: 8px;"/>
<img  alt="start" src="https://github.com/user-attachments/assets/3cdfb887-d761-4966-8481-0ef5d2219342" height="250" style="margin: 0 10px; border-radius: 8px;" />
<img alt="prologue" src="https://github.com/user-attachments/assets/0cec710a-63ba-476d-8cea-1ee47e3b4315" height="250" style="margin: 0 10px; border-radius: 8px;"/>
</p>

#### Every Choice Matters
<p align="center">
<img  alt="image" src="https://github.com/user-attachments/assets/9704f340-897f-4770-90c3-2d447334fce1" height="250" style="margin: 0 10px; border-radius: 8px;"/>

<img  alt="image" src="https://github.com/user-attachments/assets/be1cd170-253e-4499-940f-c9a765968d15" height="250" style="margin: 0 10px; border-radius: 8px;"/>
<img alt="image" src="https://github.com/user-attachments/assets/fa1a797b-114d-4120-9980-6c333c8e1532" height="250" style="margin: 0 10px; border-radius: 8px;"/>
<img alt="image" src="https://github.com/user-attachments/assets/91e0e8d8-2bf4-4360-b0f5-13ce4a440c8e" height="250" style="margin: 0 10px; border-radius: 8px;"/>

  
</p>
---

## ✨ Project Overview

This project is a submission for the **Nano Banana Hackathon**, built in 48 hours to showcase the power of the Gemini 2.5 Flash Image Preview ("Nano Banana") API.

The core idea is to create a deeply personal and immersive storytelling experience. Users can cast themselves as the main character of an adventure by uploading a selfie. Our application then uses Gemini's powerful editing features to generate a visually consistent hero. A second "Dungeon Master" AI crafts a rich, branching narrative, and each step is brought to life with dynamically generated scenes and atmospheric audio from ElevenLabs, all based on the player's choices.

### Core Technologies
- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Python with FastAPI
- **Deployment:** Heroku
- **AI Image Generation:** Google Gemini 2.5 Flash Image
- **AI Story Generation:** Google Gemini 1.5 Flash
- **AI Audio Generation:** ElevenLabs API

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
- Python 3.11+
- Node.js v18+ and npm
- A `.env` file in the project root with your `GEMINI_API_KEY` and `ELEVENLABS_API_KEY`.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd banana-split-stories
    ```

2.  **Set up environment variables:**
    Create a new file named `.env` in the root of the project. Add your secret API keys like so:
    ```bash
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ELEVENLABS_API_KEY="YOUR_API_KEY_HERE"
    ```

3.  **Install all dependencies:**
    This project uses a single script to install both frontend and backend dependencies.
    ```bash
    # Make the script executable (you only need to do this once)
    chmod +x install.sh

    # Run the installation
    ./install.sh
    ```

## 🏃 Running the Application

A single script handles the entire process of building the frontend and launching the backend server.

**To start the application:**
```bash
# Make the script executable (you only need to do this once)
chmod +x start.sh

# Run the start script
./start.sh

```

📂 Project Structure
A brief overview of the key directories:
```bash
/
├── api/                # Contains the Python FastAPI backend and all generator modules
├── frontend/           # Contains the React (TypeScript) frontend application
├── assets/             # Dynamically generated game assets (images, audio)
├── scripts/            # Helper scripts (e.g., mock data generation)
├── Procfile            # Heroku startup command
├── requirements.txt    # Python dependencies
└── README.md           # You are here!
```

## 🗺️ Roadmap & Future Work
While the core focus of the hackathon is the MVP, here is the future vision for Banana Split Stories:

[X] Version 1 (MVP): A functional 3-step dynamic adventure with branching choices, selfie-to-character generation, and AI-powered visuals and audio.

[ ] Version 2 (Dice Mechanics): Introduce a dice roll system for skill checks and choice outcomes to enhance the "game" feel.

[ ] Version 3 (Video Generation): Evolve the experience from static images to short, animated clips using generative video models.

[ ] Version 4 (Multi-player): Transform the solo adventure into a collaborative, multi-player campaign.

## 🚀 About Me

A jack of all trades in software engineering, with 15 years of crafting full-stack solutions, scalable architectures, and pixel-perfect designs. Now expanding my horizons into AI/ML, blending experience with curiosity to build the future of tech—one model at a time.

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://gaurangdave.me/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gaurangvdave/)
