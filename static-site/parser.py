
import os
import re
import markdown2

def create_static_site():
    """
    Parses Markdown files in the parent directory and generates a static website.
    """
    output_dir = "static-site"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # HTML template for individual question pages
    question_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{question_title}</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script src="https://unpkg.com/mermaid@8.13.3/dist/mermaid.min.js"></script>
    </head>
    <body>
        <div class="container mt-5">
            <h1>{question_title}</h1>
            {question_body}
        </div>
        <script>
            mermaid.initialize({{startOnLoad:true}});
            localStorage.setItem('last_visited', window.location.pathname);
        </script>
    </body>
    </html>
    """

    # HTML template for the index page
    index_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SRE Interview Questions</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            .last-visited {{
                background-color: #f0f0f0;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container mt-5">
            <h1>SRE Interview Questions</h1>
            <ul class="list-group" id="question-list">
                {question_links}
            </ul>
        </div>
        <script>
            document.addEventListener('DOMContentLoaded', function() {{
                const lastVisited = localStorage.getItem('last_visited');
                if (lastVisited) {{
                    const links = document.querySelectorAll('#question-list a');
                    links.forEach(link => {{
                        if (link.getAttribute('href') === lastVisited) {{
                            link.parentElement.classList.add('last-visited');
                        }}
                    }});
                }}

                const questionLinks = document.querySelectorAll('#question-list a');
                questionLinks.forEach(link => {{
                    link.addEventListener('click', function(e) {{
                        localStorage.setItem('last_visited', this.getAttribute('href'));
                    }});
                }});
            }});
        </script>
    </body>
    </html>
    """

    question_links = []
    question_count = 0

    # Find all Markdown files in the parent directory
    for filename in os.listdir(".."):
        if filename.endswith(".md"):
            with open(os.path.join("..", filename), "r") as f:
                content = f.read()

            # Split content into questions based on '###'
            questions = re.split(r"###\s+\d+\.\s+", content)
            if len(questions) > 1:
                for i, question_block in enumerate(questions[1:]):
                    question_count += 1
                    lines = question_block.strip().split("\\n")
                    question_title = lines[0]
                    question_body_md = "\\n".join(lines[1:])
                    
                    # Convert markdown to HTML
                    question_body_html = markdown2.markdown(question_body_md, extras=["fenced-code-blocks", "code-friendly"])

                    # Create individual question HTML file
                    question_filename = f"question_{question_count}.html"
                    with open(os.path.join(output_dir, question_filename), "w") as qf:
                        qf.write(question_template.format(
                            question_title=question_title,
                            question_body=question_body_html
                        ))
                    
                    question_links.append(f'<li class="list-group-item"><a href="{question_filename}">{question_title}</a></li>')

    # Create index.html
    with open(os.path.join(output_dir, "index.html"), "w") as index_file:
        index_file.write(index_template.format(question_links="\\n".join(question_links)))

if __name__ == "__main__":
    create_static_site()
    print(f"Static site generated successfully in '{os.path.abspath('static-site')}'")

