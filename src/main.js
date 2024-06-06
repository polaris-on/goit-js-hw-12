import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import {createMarkup} from './js/render-functions'
import {getImages} from './js/pixabay-api'

const searchForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const fotoGallery = new SimpleLightbox('.gallery a');
const loader = document.querySelector('.loader');
const loaderOverlay = document.querySelector('.loader__overlay');

const handleSubmit = event => {
  event.preventDefault();
  loader.style.display = "block";
  loaderOverlay.style.display = "block";
  setTimeout(() => {
    loader.style.display = "none";
    loaderOverlay.style.display = "none";
  }, 1000);
  const searchQuery = searchForm.elements.search.value.trim();
  if (!searchQuery) {
    iziToast.error({
      title: 'Error',
      message: 'Empty query',
      messageColor: '#fff',
    });
    return;
  }
  getImages(searchQuery)
    .then(data => {
      if(data.hits.length === 0) {
        gallery.innerHTML = '';
        throw new Error('Sorry, there are no images matching your search query. Please try again!');
      }
      const markup = createMarkup(data.hits);
      gallery.innerHTML = markup;
      fotoGallery.refresh();
      iziToast.success({
        title: 'Success',
        message: 'Images loaded successfully',
        messageColor: '#fff',
      });
    })
    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: error.message,
        backgroundColor: '#EF4040',
        iconColor: '#ffffff',
        messageColor: '#fff'
      });
    });
};
searchForm.addEventListener('submit', handleSubmit);