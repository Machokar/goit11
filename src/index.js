import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
const Urlb = 'https://pixabay.com/api/';
const searchForm = document.querySelector('form.search-form');
const List = document.querySelector('div.gallery');
const buttonLoadMore = document.querySelector('div.load-wrapper');
buttonLoadMore.setAttribute('hidden', true);
let pageN;
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});
searchForm.addEventListener('submit', firstbutton);
buttonLoadMore.addEventListener('click', secondbutton);
async function loadPics(page = 1) {
  let response;
  try {
    response = await axios(Urlb, {
      params: {
        key: '41215074-ef0f8e3a8533520c9a91db271',
        q: searchForm.elements.searchQuery.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: 40,
      },
    });
  } catch (error) {
    Notiflix.Notify.failure(`${error}`);
    return;
  }
  const markup = response.data.hits
    .map(
      mes =>
        `<div class="photo-card">
            <a class="gallery-link" href=${mes.largeImageURL} ></a>
            <div class="image-map">
            <img class="gallery-image" src=${mes.previewURL} alt=${mes.tags} loading="lazy" />
            </div>
            <div class="info">
              <p class="info-item">Likes ${mes.likes}</p>
              <p class="info-item">Views ${mes.views}</p>
              <p class="info-item">Comments ${mes.comments}</p>
              <p class="info-item">Downloads ${mes.downloads}</p>
            </div>
        </div>`
    )
    .join('');
  buttonLoadMore.removeAttribute('hidden', true);
  if (response.data.totalHits === 0) {
    buttonLoadMore.setAttribute('hidden', true);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    if (page === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }
  }
  if ((response.data.totalHits <= page * 40) & (page !== 1)) {
    buttonLoadMore.setAttribute('hidden', true);
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  List.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();

  if (page > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 1.5,
      behavior: 'smooth',
    });
  }
  return;
}
function firstbutton(event) {
  event.preventDefault();
  List.innerHTML = '';
  pageN = 1;
  loadPics();
  buttonLoadMore.setAttribute('hidden', true);
}
function secondbutton(event) {
  event.preventDefault();
  pageN += 1;
  loadPics(pageN);
}
