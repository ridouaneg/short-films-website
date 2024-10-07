import pandas as pd
import json

sfd = pd.read_csv("data/sfd.csv")
data = json.load(open("data/movies.json"))

results = []
for elem in data:
    df = sfd[(sfd.video_id == elem["id"])].sort_values(by="question_id")
    elem["questions"] = [{
        "question": row["question"],
        "answer": row["answer"],
        "options": [row["option_0"], row["option_1"], row["option_2"], row["option_3"], row["option_4"]],
        "correct_answer": row["correct_answer"],
    } for _, row in df.iterrows()]
    results.append(elem)

json.dump(results, open("data/movies_.json", "w"), indent=4)
