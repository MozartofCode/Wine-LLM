# Wine-LLM – AI-Powered Wine Recommendation System

**An AI-powered Retrieval-Augmented Generation (RAG) application that provides personalized wine recommendations based on user prompts, utilizing multiple Large Language Models (LLMs) for comparison.**

## Overview

**Wine-LLM** is a web-based application designed to assist users in selecting the perfect wine for various occasions. By leveraging a Retrieval-Augmented Generation (RAG) approach, the system processes user inputs to provide tailored wine suggestions. Users can compare responses from different LLMs, including OpenAI, Llama, and a custom RAG model, to choose the recommendation that best suits their preferences.

## Key Features

- **Personalized Wine Recommendations**: Input scenarios like "I'm having seafood tonight; what French wine pairs well?" to receive tailored suggestions.
- **LLM Comparison**: Evaluate and compare responses from OpenAI, Llama, and a custom RAG model.
- **Interactive Web Interface**: User-friendly frontend built with Next.js for seamless interactions.
- **Backend Processing**: Flask-based backend handles API requests, model interactions, and data retrieval.
- **Embedding Generation**: Utilize the `Wine_RAG.ipynb` notebook to process and store embeddings for efficient data retrieval.

## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Flask (Python)
- **LLMs**: OpenAI API, Llama, Custom RAG Model
- **Environment Management**: Python's `venv` and `requirements.txt`

## 🛠️ Installation & Setup

### **Prerequisites**

- **Python 3.7+**
- **Node.js and npm**
- **OpenAI API Key**: Obtain from [OpenAI](https://platform.openai.com/account/api-keys)
- **Groq API Key**: Obtain from [Groq](https://groq.com/)

### **Clone the Repository**

```bash
git clone https://github.com/MozartofCode/Wine-LLM.git
cd Wine-LLM
```

### **Backend Setup**

1. **Create a Virtual Environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Set Environment Variables**:

   Create a `.env` file in the root directory and add:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Generate Embeddings**:

   Run the `Wine_RAG.ipynb` notebook to process wine data and generate embeddings. Ensure the resulting embeddings are saved appropriately for the backend to access.

5. **Start the Flask Server**:

   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5000`.

### **Frontend Setup**

1. **Navigate to the Frontend Directory**:

   ```bash
   cd frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start the Frontend Server**:

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:3000`.

## 🎯 Usage

1. **Access the Application**:

   Open your browser and navigate to `http://localhost:3000`.

2. **Input Your Scenario**:

   Enter a description of your meal or occasion, such as:

   - "I'm having grilled salmon tonight; what wine would pair well?"
   - "Looking for a wine to accompany dark chocolate dessert."

3. **Select LLM for Recommendation**:

   Choose between OpenAI, Llama, or the custom RAG model to generate a wine recommendation.

4. **View and Compare Results**:

   Analyze the suggestions provided by each model to select the most suitable wine.

## Future Enhancements

- **Enhanced Database Integration**: Incorporate a comprehensive wine database for more accurate recommendations.
- **Feedback Mechanism**: Enable users to provide feedback on recommendations to improve model accuracy.

## Contact

**Author**: Bertan Berker  
📧 Email: bb6363@rit.edu  
💻 GitHub: [MozartofCode](https://github.com/MozartofCode)

**Author**: Jacob Sakelarios  
📧 Email: 
💻 GitHub: 