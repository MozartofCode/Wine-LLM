import faiss
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

# Load the real model
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embeddings(text: str) -> np.ndarray:
    """
    Get real embeddings for the given text using SentenceTransformer.
    """
    embedding = model.encode([text])[0]
    return embedding.astype('float32')   



class VectorDB:
    def __init__(self, embedding_file: str, metadata_file: str):
        # Load precomputed wine embeddings
        self.embeddings = np.load(embedding_file)
        
        # Load metadata (wine descriptions, titles, etc.)
        self.df = pd.read_csv(metadata_file)
        
        # Build FAISS index
        self.index = faiss.IndexFlatL2(self.embeddings.shape[1])
        self.index.add(self.embeddings)
        
    def search(self, query_embedding: np.ndarray, top_k: int = 3):
        """
        Search for similar wines based on the query embedding.
        """
        query_embedding = np.array(query_embedding).astype('float32').reshape(1, -1)
        distances, indices = self.index.search(query_embedding, top_k)
        
        results = self.df.iloc[indices[0]]  # Retrieve wine entries
        return results
