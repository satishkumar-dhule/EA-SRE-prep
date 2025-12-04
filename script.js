let questions = [];

fetch('interview_prep.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        createCards();
    });

function createCards() {
    const container = document.getElementById('cards-container');
    questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face front">
                    <h3>${q.question}</h3>
                    <textarea placeholder="Type your answer here..."></textarea>
                    <button onclick="submitAnswer(${index})">Submit Answer</button>
                </div>
                <div class="card-face back">
                    <h3>Ideal Answer</h3>
                    <p>${q.idealAnswer.replace(/\n/g, '<br>')}</p>
                    <div class="feedback">
                        <h4>Key Points Check:</h4>
                        <ul id="keypoints-${index}"></ul>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function submitAnswer(index) {
    const card = document.querySelectorAll('.card')[index];
    const textarea = card.querySelector('textarea');
    const userAnswer = textarea.value.toLowerCase();
    const q = questions[index];

    const fuse = new Fuse([userAnswer], { threshold: 0.4 });

    const keypointsList = card.querySelector(`#keypoints-${index}`);
    keypointsList.innerHTML = '';

    q.keyPoints.forEach(point => {
        const results = fuse.search(point.toLowerCase());
        const isPresent = results.length > 0 && results[0].score < 0.4; // Adjust threshold
        const li = document.createElement('li');
        li.textContent = point;
        li.className = isPresent ? 'present' : 'missing';
        keypointsList.appendChild(li);
    });

    card.classList.add('flipped');
}