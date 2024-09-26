
import { API_KEY, BASE_URL, PER_PAGE } from './js/pixabay-api';
import { fetchImages } from './js/pixabay-api';
import { renderMarkup } from './js/render-functions';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const form = document.querySelector(`.search-form-js`)
const gallery = document.querySelector(`.gallery-js`)
const loadMoreButton = document.querySelector(`.load-more`);
const loadingIndicator = document.querySelector(`.loading-indicator`);


let lightbox = new SimpleLightbox('.gallery-item', {
  captionsData: 'alt',
  captionDelay: 250,
});

let searchImages = '';
let page = 1;
let totalHits = 0;

form.addEventListener(`submit`, onSubmit)
loadMoreButton.addEventListener(`click`,loadMoreImages)

async function onSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  
  searchImages = form.elements.query.value;

  if (searchImages === '') {
    iziToast.error({
      title: 'No Results',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return; 
  }
  
  page = 1;

  gallery.innerHTML = ''; 
  loadMoreButton.style.display = 'none'; 
  loadingIndicator.style.display = 'block'; 


  try {
    const { hits, totalHits: total } = await fetchImages(searchImages, page);

    totalHits = total;

    renderMarkup(hits, gallery);
    
    lightbox.refresh();

    if (hits.length > 0 && totalHits > PER_PAGE) {
      loadMoreButton.style.display = 'block'; 
    } else if (totalHits === 0) {
      iziToast.error({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
    }
  } catch (error){
    console.log(error);
    iziToast.error({
      title: 'No Results',
      message: 'Sorry, there are no images matching your search query. Please try again!',
      position: 'topRight',
    });
  } finally {
    loadingIndicator.style.display = 'none';
    form.reset();
  }
}

async function loadMoreImages() {
  loadingIndicator.style.display = 'block'; 
  page++; 

  try {
    const { hits } = await fetchImages(searchImages, page);
    renderMarkup(hits, gallery); 

    lightbox.refresh(); 

    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    const totalDisplayedImages = gallery.querySelectorAll('.gallery-item').length;
    if (totalDisplayedImages >= totalHits) {
      loadMoreButton.style.display = 'none'; 
      iziToast.info({
        title: 'Information',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    console.log(error);
    iziToast.error({
      title: 'No Results',
      message: 'Sorry, there are no images matching your search query. Please try again!',
      position: 'topRight',
    });
  } finally {
    loadingIndicator.style.display = 'none'; 
  }
}
