import pandas as pd
from flask import Flask, make_response
from flask import request
from flask_cors import CORS
from chatbot import query_chatbot

app = Flask(__name__)
CORS(app)

PREDEFINED_TOPIC = ["Politics", "Education", "Technology", "Environment", "Healthcare", "All", ""]

@app.route("/query",methods=['POST'])
def execute():
    query = request.json.get('query', "")
    topics = request.json.get('topics', [])

    topics = list(set(topics).intersection(PREDEFINED_TOPIC))
    response = query_chatbot(query, topics)

    return {
        'response': response
    }



@app.route("/logs",methods=['GET'])
def get_logs():

    df = pd.read_csv("conversation.csv")
    resp = make_response(df.to_csv())
    resp.headers["Content-Disposition"] = "attachment; filename=query_logs.csv"
    resp.headers["Content-Type"] = "text/csv"
    return resp

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=9999)