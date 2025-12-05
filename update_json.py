import json

with open("interview_prep.json", "r") as f:
    data = json.load(f)

for category, questions in data.items():
    for q in questions:
        # Add difficulty: easy if simple, hard if complex, medium default
        if "beginner" in q["question"].lower() or "basic" in q["question"].lower():
            diff = "easy"
        elif (
            "design" in q["question"].lower()
            or "architect" in q["question"].lower()
            or "implement" in q["question"].lower()
        ):
            diff = "hard"
        else:
            diff = "medium"
        q["difficulty"] = diff

        # Add tags: based on category
        tags = []
        if "AWS" in category:
            tags.append("AWS")
        if "Reliability" in category:
            tags.append("Reliability")
        if "Scalability" in category:
            tags.append("Scalability")
        if "Observability" in category:
            tags.append("Observability")
        if "Cost" in category:
            tags.append("Cost Optimization")
        if "Multi-Cloud" in category:
            tags.append("Multi-Cloud")
        if "Gaming" in category:
            tags.append("Gaming SRE")
        if "Leadership" in category:
            tags.append("Leadership")
        if "SRE Fundamentals" in category:
            tags.append("SRE")
        if "Tool-Specific" in category:
            tags.append("Tools")
        if "Scenario-Based" in category:
            tags.append("Scenarios")
        q["tags"] = tags

with open("interview_prep.json", "w") as f:
    json.dump(data, f, indent=4)
