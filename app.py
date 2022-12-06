from flask import Flask
from flask import request
from flask_cors import CORS
from chatbot import query_chatbot

app = Flask(__name__)
CORS(app)


@app.route("/query",methods=['POST'])
def execute():

    query = request.json.get('query', "")
    topics = request.json.get('topics', "")

    response = query_chatbot(query, topics)

    return {
        'response': response
    }


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=9999)