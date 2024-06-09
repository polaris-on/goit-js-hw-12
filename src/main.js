import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './js/render-functions';
import { getImages } from './js/pixabay-api';

const searchForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const fotoGallery = new SimpleLightbox('.gallery a');
const loader = document.querySelector('.loader');
const loaderOverlay = document.querySelector('.loader__overlay');
const loadMoreBtn = document.querySelector('.js-load-more');

let page = 1;
const perPage = 18;

function waitForImagesToLoad() {
  const images = gallery.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => {
    return new Promise((resolve, reject) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = resolve;
        img.onerror = reject;
      }
    });
  });
  return Promise.all(imagePromises);
}

async function handleSubmit(event) {
  event.preventDefault();
  if (event.target.classList.contains('form')) {
    gallery.innerHTML = '';
    page = 1;
    loader.style.display = 'block';
    loaderOverlay.style.display = 'block';
    // setTimeout(() => {
    //   loader.style.display = 'none';
    //   loaderOverlay.style.display = 'none';
    // }, 1000);
  }
  const searchQuery = searchForm.elements.search.value.trim();
  if (!searchQuery) {
    iziToast.error({
      title: 'Error',
      message: 'Empty query',
      messageColor: '#fff',
    });
    loader.style.display = 'none';
    loaderOverlay.style.display = 'none';
    return;
  }
  await getImages(searchQuery, page, perPage)
    .then(async data => {
      const totalHints = data.totalHits;

      if (data.hits.length === 0) {
        gallery.innerHTML = '';
        loadMoreBtn.classList.add('load-more-hidden');
        loader.style.display = 'none';
        loaderOverlay.style.display = 'none';
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again!'
        );
      }
      const markup = createMarkup(data.hits);
      gallery.insertAdjacentHTML('beforeend', markup);
      fotoGallery.refresh();

      await waitForImagesToLoad();

      iziToast.success({
        title: 'Success',
        message: 'Images loaded successfully',
        messageColor: '#fff',
      });
      loader.style.display = 'none';
      loaderOverlay.style.display = 'none';
      if (page * perPage >= totalHints) {
        iziToast.success({
          title: 'Warning',
          message: "We're sorry, but you've reached the end of search results.",
          messageColor: 'red',
        });
        loadMoreBtn.classList.add('load-more-hidden');
      }

      if (page === 1 && totalHints > perPage) {
        loadMoreBtn.classList.remove('load-more-hidden');
      }
      if (event.target.classList.contains('form')) {
        return;
      }
      let cardImg = document.querySelector('.card__img');
      window.scrollBy({
        top: cardImg.height * 2 + 48,
        left: 0,
        behavior: 'smooth',
      });
    })
    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: error.message,
        backgroundColor: '#EF4040',
        iconColor: '#ffffff',
        messageColor: '#fff',
      });
    })
    .finally(data => {
      page++;
    });
}
searchForm.addEventListener('submit', handleSubmit);

loadMoreBtn.addEventListener('click', handleSubmit);
