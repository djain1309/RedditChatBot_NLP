import chitchat_dataset as ccc
import pandas as pd
import pysolr
import requests

messages = list(ccc.MessageDataset())
data = {"msg": [], "reply":[], "id":[]}

for i in range(len(messages)-1):
    data["id"].append(f"msg_{i}")
    data["msg"].append(messages[i])
    data["reply"].append(messages[i+1])

df = pd.DataFrame(data)

CORE_NAME = "chitchat"
AWS_IP = "34.130.44.231"

class Indexer:
    def __init__(self):
        self.solr_url = f'http://{AWS_IP}:8983/solr/'
        self.connection = pysolr.Solr(self.solr_url + CORE_NAME, always_commit=True, timeout=5000000)

    def create_documents(self, docs):
        total_docs = len(docs)
        for i in range(0, total_docs, 5000):
            try:
                print(self.connection.add(docs[i:i+5000]))
            except Exception as e:
                print(e)

    def add_fields(self):
        data = {
            "add-field": [
                {
                    "name": "id",
                    "type": "string",
                    "multiValued": False,
                    "indexed": True,
                    "stored": True
                },
                {
                    "name": "msg",
                    "type": "text_en",
                    "multiValued": False,
                    "indexed": True,
                    "stored": True
                },
                {
                    "name": "reply",
                    "type": "text_en",
                    "multiValued": False,
                    "indexed": True,
                    "stored": True
                },
            ]
        }

        print(requests.post(self.solr_url + CORE_NAME + "/schema", json=data).json())


if __name__ == "__main__":
    i = Indexer()
    i.add_fields()
    i.create_documents(df.to_dict("records"))
