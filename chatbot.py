import joblib
import numpy as np
import pysolr
from simpletransformers.classification import ClassificationModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

sentence_encoder_model = SentenceTransformer('bert-base-nli-mean-tokens')

tfidf = joblib.load("tfidif_normalized_dict.pkl")
chitchat_encoding = joblib.load("chitchat_encoding.pkl")
reddit_data_encoding = joblib.load("reddit_parent_id_embedding_map.pkl")

saved_model = ClassificationModel(model_type='roberta', model_name='outputs/model/', use_cuda=False)

REDDIT = pysolr.Solr('http://34.130.189.193:8983/solr/reddit_bm25')
CHITCHAT = pysolr.Solr('http://34.130.189.193:8983/solr/chitchat')

def query_chatbot(query, topic=None):
    q_embedding = sentence_encoder_model.encode(query)
    final_query = ""
    prediction = saved_model.predict([query])
    reply = ""
    if prediction[0][0] == 1 and not topic:
        params = {
            "defType": "edismax",
            "df": "msg",
            'wt': 'json',
            'rows': 30,
            "indent": "true",
            "mm": "40%"
        }
        for term in query.split():
            final_query += f"msg:{term}^{tfidf.get(term, 1)} "
        final_query = final_query.strip()
        search_data = CHITCHAT.search(final_query, **params)
        docs = search_data.raw_response["response"]["docs"]
        if len(docs) > 0:
            result_encodings = [chitchat_encoding[int(c["id"].split("_")[-1])] for c in docs]

            im_arr = cosine_similarity([q_embedding], result_encodings)
            top_idx = np.argmax(im_arr)
            reply = docs[top_idx].get("reply", "")
    else:
        params = {
            "defType": "edismax",
            "qf": "parent_body parent_selftext",
            'wt': 'json',
            'rows': 30,
            "indent": "true",
            "mm": "60%",
            "fl": "*, score"
        }
        for term in query.split():
            final_query += f"parent_body:{term}^{tfidf.get(term, 1) * 1.2} parent_selftext:{term}^{tfidf.get(term, 1)}*0.8 "
        params["bq"] = final_query
        if topic:
            params["fq"] = f"topic:({topic})"
        search_data = REDDIT.search("*:*", **params)
        docs = search_data.raw_response["response"]["docs"]
        if len(docs) > 0:
            result_encodings = [reddit_data_encoding[c["parent_id"]] for c in docs]
            im_arr = cosine_similarity([q_embedding], result_encodings)
            top_idx = np.argmax(im_arr)
            if docs[top_idx].get("score", 10) < 4:
                reply = "Didn't understood you"
            else:
                reply = docs[top_idx].get("body", "")

    if reply.strip() == "":
        reply = "I didn't understand that"
    return reply


