// Extract movie ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (!movieId) {
    document.body.innerHTML = '<h2>Invalid movie ID.</h2>';
} else {
    // Fetch the movies data
    fetch('data/movies.json')
        .then(response => response.json())
        .then(data => {
            const movie = data.find(m => m.id === parseInt(movieId));
            if (movie) {
                populateMovieDetails(movie);
            } else {
                document.body.innerHTML = '<h2>Movie not found.</h2>';
            }
        })
        .catch(error => console.error('Error fetching movie:', error));
}

function populateMovieDetails(movie) {
    document.getElementById('title').textContent = movie.title;

    // Embed YouTube video
    const videoContainer = document.getElementById('video-container');
    const iframe = document.createElement('iframe');
    iframe.width = "560";
    iframe.height = "315";
    iframe.src = `https://www.youtube.com/embed/${extractYouTubeID(movie.youtube_url)}`;
    iframe.title = movie.title;
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    videoContainer.appendChild(iframe);

    // Populate details
    document.getElementById('director').textContent = movie.director;
    document.getElementById('actors').textContent = movie.actors.replace(/\|/g, ', ');
    document.getElementById('duration').textContent = movie.duration;
    document.getElementById('country').textContent = movie.country;
    document.getElementById('language').textContent = movie.language;
    document.getElementById('synopsis').textContent = movie.synopsis;
}

// Helper function to extract YouTube video ID
function extractYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
}
