const moviesPerPage = 9;
let currentPage = 1;
let movies = [];
let filteredMovies = []; // Holds the movies after applying search and filters

// Fetch the movies data
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    setupEventListeners();
});

// Fetch movies from JSON and initialize
function fetchMovies() {
    showLoading(true);
    fetch('data/movies.json')
        .then(response => response.json())
        .then(data => {
            // Sort movies by release_date descending by default
            // movies = data.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            // Sort movies by title A-Z
            movies = data.sort((a, b) => a.title.localeCompare(b.title));
            filteredMovies = [...movies]; // Initialize filteredMovies
            populateFilters();
            displayMovies();
            setupPagination();
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            showLoading(false);
            displayError('Failed to load movies.');
        });
}

// Display loading indicator
function showLoading(isLoading) {
    const loading = document.getElementById('loading');
    loading.style.display = isLoading ? 'block' : 'none';
}

// Display error message
function displayError(message) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = `<p>${message}</p>`;
}

// Populate filter dropdowns based on movies data
function populateFilters() {
    const countryFilter = document.getElementById('country-filter');
    const languageFilter = document.getElementById('language-filter');

    const countries = [...new Set(movies.map(movie => movie.country))].sort();
    const languages = [...new Set(movies.map(movie => movie.language))].sort();

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = language;
        languageFilter.appendChild(option);
    });
}

// Setup event listeners for search, filters, and sorting
function setupEventListeners() {
    // const searchButton = document.getElementById('search-button');
    // const clearSearchButton = document.getElementById('clear-search-button');
    // const searchInput = document.getElementById('search-input');
    const countryFilter = document.getElementById('country-filter');
    const languageFilter = document.getElementById('language-filter');
    const sortOptions = document.getElementById('sort-options');

    // searchButton.addEventListener('click', applyFilters);
    // clearSearchButton.addEventListener('click', () => {
    //     searchInput.value = '';
    //     applyFilters();
    // });

    // searchInput.addEventListener('keyup', (event) => {
    //     if (event.key === 'Enter') {
    //         applyFilters();
    //     }
    // });

    countryFilter.addEventListener('change', applyFilters);
    languageFilter.addEventListener('change', applyFilters);
    sortOptions.addEventListener('change', applySorting);
}

// Apply search and filter criteria
function applyFilters() {
    // const searchQuery = document.getElementById('search-input').value.trim().toLowerCase();
    const selectedCountry = document.getElementById('country-filter').value;
    const selectedLanguage = document.getElementById('language-filter').value;

    filteredMovies = movies.filter(movie => {
        // const matchesSearch =
        //     movie.title.toLowerCase().includes(searchQuery) ||
        //     movie.director.toLowerCase().includes(searchQuery) ||
        //     movie.actors.toLowerCase().includes(searchQuery.replace(/\s/g, '')); // Removing spaces for actors separated by '|'

        const matchesCountry = selectedCountry ? movie.country === selectedCountry : true;
        const matchesLanguage = selectedLanguage ? movie.language === selectedLanguage : true;

        return matchesCountry && matchesLanguage;
        // return matchesSearch && matchesCountry && matchesLanguage;
    });

    currentPage = 1; // Reset to first page after filtering
    displayMovies();
    setupPagination();
}

// Apply sorting based on selected option
function applySorting() {
    const sortValue = document.getElementById('sort-options').value;

    if (sortValue === '') {
        // Default sorting by release_date ascending
        filteredMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    } else {
        const [key, order] = sortValue.split('-');
        filteredMovies.sort((a, b) => {
            if (key === 'title') {
                if (a.title.toLowerCase() < b.title.toLowerCase()) return order === 'asc' ? -1 : 1;
                if (a.title.toLowerCase() > b.title.toLowerCase()) return order === 'asc' ? 1 : -1;
                return 0;
            } else if (key === 'release_date') {
                return order === 'asc'
                    ? new Date(a.release_date) - new Date(b.release_date)
                    : new Date(b.release_date) - new Date(a.release_date);
            } else if (key === 'duration') {
                return order === 'asc' ? a.duration - b.duration : b.duration - a.duration;
            }
            return 0;
        });
    }

    currentPage = 1; // Reset to first page after sorting
    displayMovies();
    setupPagination();
}

// Display movies for the current page
function displayMovies() {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = '';

    if (filteredMovies.length === 0) {
        movieGrid.innerHTML = '<p>No movies found.</p>';
        showLoading(false);
        return;
    }

    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const paginatedMovies = filteredMovies.slice(start, end);

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

    showLoading(false);
    // Update the URL without reloading the page
    updateURL();
}

// Setup pagination controls
function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

    if (totalPages <= 1) {
        // No need for pagination
        return;
    }

    // First page button
    if (currentPage > 2) {
        const firstButton = document.createElement('button');
        firstButton.textContent = '<<';
        firstButton.title = 'First Page';
        firstButton.addEventListener('click', () => {
            currentPage = 1;
            displayMovies();
            setupPagination();
            scrollToPagination();
        });
        pagination.appendChild(firstButton);
    }

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = '<';
        prevButton.title = 'Previous Page';
        // prevButton.disabled = currentPage === 1;
        // prevButton.classList.add(currentPage === 1 ? 'disabled' : '');
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayMovies();
                setupPagination();
                scrollToPagination();
            }
        });
        pagination.appendChild(prevButton);
    }

    // Calculate startPage and endPage (currentPage - 2 to currentPage + 2)
    let startPage = currentPage - 2;
    let endPage = currentPage + 2;

    // Adjust if at the beginning
    if (startPage < 1) {
        endPage += (1 - startPage);
        startPage = 1;
    }

    // Adjust if at the end
    if (endPage > totalPages) {
        startPage -= (endPage - totalPages);
        endPage = totalPages;
    }

    // Ensure startPage is at least 1
    startPage = Math.max(startPage, 1);

    // Create page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.title = `Page ${i}`;
        if (i === currentPage) {
            pageButton.classList.add('active');
            // pageButton.disabled = true; // Make current page non-clickable
        } else {
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayMovies();
                setupPagination();
                scrollToPagination();
            });
        }
        pagination.appendChild(pageButton);
    }

    // Next button
    if (currentPage < totalPages - 1) {
        const nextButton = document.createElement('button');
        nextButton.textContent = '>';
        nextButton.title = 'Next Page';
        // nextButton.disabled = currentPage === totalPages;
        // nextButton.classList.add(currentPage === totalPages ? 'disabled' : '');
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayMovies();
                setupPagination();
                scrollToPagination();
            }
        });
        pagination.appendChild(nextButton);
    }

    // Last page button
    if (currentPage < totalPages) {
        const lastButton = document.createElement('button');
        lastButton.textContent = '>>';
        lastButton.title = 'Last Page';
        lastButton.addEventListener('click', () => {
            currentPage = totalPages;
            displayMovies();
            setupPagination();
            scrollToPagination();
        });
        pagination.appendChild(lastButton);
    }
}

// Update the URL with the current page, search, filters, and sorting
function updateURL() {
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);

    // Get current search and filter values
    // const searchQuery = document.getElementById('search-input').value.trim();
    const selectedCountry = document.getElementById('country-filter').value;
    const selectedLanguage = document.getElementById('language-filter').value;
    const sortValue = document.getElementById('sort-options').value;

    // if (searchQuery) {
    //     url.searchParams.set('search', searchQuery);
    // } else {
    //     url.searchParams.delete('search');
    // }

    if (selectedCountry) {
        url.searchParams.set('country', selectedCountry);
    } else {
        url.searchParams.delete('country');
    }

    if (selectedLanguage) {
        url.searchParams.set('language', selectedLanguage);
    } else {
        url.searchParams.delete('language');
    }

    if (sortValue) {
        url.searchParams.set('sort', sortValue);
    } else {
        url.searchParams.delete('sort');
    }

    window.history.replaceState({}, '', url);
}

// Scroll to the pagination controls smoothly
function scrollToPagination() {
    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle browser's back and forward buttons
window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const searchParam = urlParams.get('search');
    const countryParam = urlParams.get('country');
    const languageParam = urlParams.get('language');
    const sortParam = urlParams.get('sort');

    if (pageParam && !isNaN(pageParam)) {
        currentPage = parseInt(pageParam, 10);
    } else {
        currentPage = 1;
    }

    // Set search input
    // const searchInput = document.getElementById('search-input');
    // if (searchParam) {
    //     searchInput.value = searchParam;
    // } else {
    //     searchInput.value = '';
    // }

    // Set country filter
    const countryFilter = document.getElementById('country-filter');
    if (countryParam) {
        countryFilter.value = countryParam;
    } else {
        countryFilter.value = '';
    }

    // Set language filter
    const languageFilter = document.getElementById('language-filter');
    if (languageParam) {
        languageFilter.value = languageParam;
    } else {
        languageFilter.value = '';
    }

    // Set sort option
    const sortOptions = document.getElementById('sort-options');
    if (sortParam) {
        sortOptions.value = sortParam;
    } else {
        sortOptions.value = '';
    }

    // Apply filters and sorting
    applyFilters();
    applySorting();
});
