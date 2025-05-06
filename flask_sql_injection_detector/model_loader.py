import pickle
import numpy as np
from tensorflow.keras.models import load_model

# Load models
model_paths = {
    "Model 1 Dataset 1": "Prajna_B_Shettigar-221IT051-trained_model-1.h5",
    "Model 1 Dataset 2": "Prajna_B_Shettigar-221IT051-trained_model-2.h5",
    "Model 2 Dataset 1": "UpasanaNayak-221IT075-trained_model.h5",
    "Model 2 Dataset 2": "UpasanaNayak-221IT075-trained_model2.h5",
}

models = {name: load_model(path) for name, path in model_paths.items()}

# Load tokenizers
tokenizer_paths = {
    "dataset_1": "tokenizer1.pkl",
    "dataset_2": "tokenizer2.pkl",
}

tokenizers = {name: pickle.load(open(path, "rb")) for name, path in tokenizer_paths.items()}

def preprocess_query(query, tokenizer, max_length=224*224):
    sequence = tokenizer.texts_to_sequences([query])
    flat_sequence = np.pad(sequence[0], (0, max_length - len(sequence[0])), 'constant')[:max_length]
    return np.array(flat_sequence).reshape(-1, 224, 224, 1)
import pickle

# #  Load tokenizer from file
# with open("/kaggle/input/dataset1/tokenizer.pkl", 'rb') as f:
#     tokenizer = pickle.load(f)

# print("Tokenizer loaded successfully.")

# test_sequences = tokenizer.texts_to_sequences(X_test)


# desired_shape = (224, 224)
# flat_test_sequences = [np.pad(seq, (0, desired_shape[0] * desired_shape[1] - len(seq)), 'constant')[:desired_shape[0] * desired_shape[1]] for seq in test_sequences]


# X_test_cnn = np.array(flat_test_sequences).reshape(-1, 224, 224, 1)


# print("Testing Data Shape:", X_test_cnn.shape)



