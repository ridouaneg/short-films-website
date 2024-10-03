const moviesPerPage = 20;
let currentPage = 1;
let movies = [];

// Fetch the movies data
fetch('data/movies.json')
    .then(response => response.json())
    .then(data => {
        // Sort movies by release_date
        movies = data.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        displayMovies();
        setupPagination();
    })
    .catch(error => console.error('Error fetching movies:', error));

// Display movies for the current page
function displayMovies() {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = '';

    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const paginatedMovies = movies.slice(start, end);

    paginatedMovies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('grid-item');

        const img = document.createElement('img');
        img.src = movie.thumbnail_url;
        img.alt = movie.title;
        img.addEventListener('click', () => {
            window.location.href = `movie.html?id=${movie.id}`;
        });

        const title = document.createElement('p');
        title.textContent = movie.title;

        movieDiv.appendChild(img);
        movieDiv.appendChild(title);
        movieGrid.appendChild(movieDiv);
    });
}

// Setup pagination controls
function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(movies.length / moviesPerPage);

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.classList.add(currentPage === 1 ? 'disabled' : '');
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayMovies();
            setupPagination();
            window.scrollTo(0, 0);
        }
    });
    pagination.appendChild(prevButton);

    // Page numbers (show limited page numbers for better UX)
    const maxPageButtons = 7; // Adjust as needed
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, currentPage + 3);

    if (currentPage <= 4) {
        startPage = 1;
        endPage = Math.min(totalPages, maxPageButtons);
    } else if (currentPage + 3 >= totalPages) {
        startPage = Math.max(1, totalPages - (maxPageButtons - 1));
        endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayMovies();
            setupPagination();
            window.scrollTo(0, 0);
        });
        pagination.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.classList.add(currentPage === totalPages ? 'disabled' : '');
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayMovies();
            setupPagination();
            window.scrollTo(0, 0);
        }
    });
    pagination.appendChild(nextButton);
}
