from csv import DictWriter


def append_dict_as_row(file_name, dict_of_elem, field_names):
    # Open file in append mode
    with open(file_name, 'a+', newline='') as write_obj:
        # Create a writer object from csv module
        # print(file_name)
        dict_writer = DictWriter(write_obj, fieldnames=field_names)
        # Add dictionary as wor in the csv
        dict_writer.writerow(dict_of_elem)


def storeChat(query, response, topic, score, chatbot="N"):
    field_names = ['query', 'response', 'topic', 'score', 'chatbot']
    row_dict = {'query': query, 'response': response, 'topic': topic,
                "score": score, "chatbot": chatbot}
    append_dict_as_row('conversation.csv', row_dict, field_names)
