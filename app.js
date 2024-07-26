const API_KEY = "7b866347507d492b9668881199265b68";
const url = "https://newsapi.org/v2/everything?q=";
const articlesPerPage = 32;
let currentPage = 1;
let totalResults = 0;

window.addEventListener('load', () => fetchNews("BATMAN"));

document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-bar').value;
    if (query) {
        showSpinner();
        currentPage = 1;
        fetchNews(query).finally(() => hideSpinner());
    }
});

document.querySelectorAll('.hover-link').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const query = event.target.getAttribute('data-query');
        showSpinner();
        currentPage = 1;
        fetchNews(query).finally(() => hideSpinner());
    });
});

document.getElementById('view-more-button').addEventListener('click', () => {
    showSpinner();
    currentPage += 1;
    const query = document.getElementById('search-bar').value;
    fetchNews(query).finally(() => hideSpinner());
});

function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('search-button').disabled = true;
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('search-button').disabled = false;
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}&pageSize=${articlesPerPage}&page=${currentPage}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        totalResults = data.totalResults;
        bindData(data.articles);
    } catch (error) {
        console.error('Error fetching news', error);
        alert('Failed to load news. Please try again later.');
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    if (currentPage === 1) {
        cardsContainer.innerHTML = ''; 
    }

    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });

    const viewMoreButton = document.getElementById('view-more-button');
    if (currentPage * articlesPerPage < totalResults) {
        viewMoreButton.style.display = 'block';
    } else {
        viewMoreButton.style.display = 'none';
    }
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    newsSource.innerHTML = `${article.source.name} ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}
