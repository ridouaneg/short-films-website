// Extract movie ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (!movieId) {
    document.body.innerHTML = '<h2>Invalid movie ID.</h2>';
} else {
    // Fetch the movie data
    fetch('data/movies_.json')
        .then(response => response.json())
        .then(data => {
            const movie = data.find(m => m.id === movieId);
            if (movie) {
                populateMovieDetails(movie);
                displayQuestionsAndAnswers(movie);
            } else {
                document.body.innerHTML = '<h2>Movie not found.</h2>';
            }
        })
        .catch(error => console.error('Error fetching movie:', error));
}

function populateMovieDetails(movie) {
    // Set the page title to the movie title
    document.title = movie.title;

    // Update the main title on the page
    document.getElementById('title').textContent = movie.title;

    // Embed YouTube video
    const videoContainer = document.getElementById('video-container');
    const iframe = document.createElement('iframe');
    iframe.width = "560";
    iframe.height = "315";
    iframe.src = `https://www.youtube.com/embed/${movie.id}`;
    iframe.title = movie.title;
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    videoContainer.appendChild(iframe);

    // Populate details
    document.getElementById('release_date').textContent = movie.release_date;
    document.getElementById('duration').textContent = movie.duration;
    document.getElementById('country').textContent = movie.country;
    document.getElementById('language').textContent = movie.language;
    document.getElementById('caption').textContent = movie.caption;
    document.getElementById('synopsis').textContent = movie.synopsis;
}

// Display the questions and answers section
function displayQuestionsAndAnswers(movie) {
    const qaList = document.getElementById('qa-list');
    qaList.innerHTML = '';

    if (movie.questions && movie.questions.length > 0) {
        // Populate the list with questions and answers
        movie.questions.forEach(q => {
            const listItem = document.createElement('li');

            // Create and append question
            const questionText = document.createElement('p');
            questionText.innerHTML = `<strong>Question:</strong> ${q.question}`;
            listItem.appendChild(questionText);

            // Create and append answer
            const answerText = document.createElement('p');
            answerText.innerHTML = `<strong>Answer:</strong> ${q.answer}`;
            listItem.appendChild(answerText);

            // Create and append options (if available)
            if (q.options && q.options.length > 0) {
                const optionsList = document.createElement('ul');
                q.options.forEach((option, index) => {
                    const optionItem = document.createElement('li');

                    // Check if this option is the correct one
                    if (index === q.correct_answer) {
                        optionItem.innerHTML = `<strong>Option ${index + 1}:</strong> ${option} <em>(Correct)</em>`;
                    } else {
                        optionItem.innerHTML = `<strong>Option ${index + 1}:</strong> ${option}`;
                    }

                    optionsList.appendChild(optionItem);
                });
                listItem.appendChild(optionsList);
            }

            // Append the list item to the qaList
            qaList.appendChild(listItem);
        });
    } else {
        // If no questions are available, display a message
        const noQuestions = document.createElement('p');
        noQuestions.textContent = 'No questions available for this movie.';
        qaList.appendChild(noQuestions);
    }
}

// Helper function to extract YouTube video ID
function extractYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

// Form submission handler
document.getElementById('annotation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const annotation = {
        movieId: movieId,
        main_characters: document.getElementById('main_characters').value,
        setting: document.getElementById('setting').value,
        plot: document.getElementById('plot').value,
        key_events: document.getElementById('key_events').value,
        plot_twist: document.getElementById('plot_twist').value,
        genre: document.getElementById('genre').value,
        style: document.getElementById('style').value,
        theme: document.getElementById('theme').value,
    };

    // Store the annotation in local storage
    localStorage.setItem(`annotation_${movieId}`, JSON.stringify(annotation));

    // Optionally, show a success message or clear the form
    alert('Submitted!');
    document.getElementById('annotation-form').reset();
});
