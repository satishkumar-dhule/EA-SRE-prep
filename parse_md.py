import re

with open("EA_SRE_3_Interview_Prep.md", "r") as f:
    content = f.read()

# Split by ###
sections = re.split(r"^### ", content, flags=re.MULTILINE)

questions = []

for section in sections[1:]:  # skip the first
    lines = section.strip().split("\n")
    question = lines[0].strip()
    # Find the answer
    answer_start = None
    for i, line in enumerate(lines):
        if line.strip() == "**Answer:**":
            answer_start = i + 1
            break
    if answer_start is None:
        continue
    answer_lines = []
    for line in lines[answer_start:]:
        if (
            line.strip().startswith("**")
            or line.strip().startswith("*")
            or line.strip().startswith("```")
        ):
            break
        answer_lines.append(line)
    idealAnswer = "\n".join(answer_lines).strip()
    # For keyPoints, extract lines starting with -
    keyPoints = []
    for line in answer_lines:
        if line.strip().startswith("- "):
            # Take the text before **Why:** or full
            text = line.strip()[2:]
            if "**Why:**" in text:
                text = text.split("**Why:**")[0].strip()
            keyPoints.append(text)
    questions.append(
        {"question": question, "idealAnswer": idealAnswer, "keyPoints": keyPoints}
    )

import json

with open("interview_prep.json", "w") as f:
    json.dump(questions, f, indent=2)
