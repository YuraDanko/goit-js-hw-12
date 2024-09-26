import axios from 'axios';

export const API_KEY = '46037450-a04b7b74a12a46e49ae394c24';
export const BASE_URL = 'https://pixabay.com/api/';
export const PER_PAGE = 15;

let page = 1;

export async function fetchImages(searchImages, currentPage = 1) {
  const options = new URLSearchParams({
    key: API_KEY,
    q: searchImages,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: PER_PAGE,
  });

  const url = `${BASE_URL}?${options}`;

  try {
    const {
      data: { hits, totalHits, total },
    } = await axios.get(url);

    return { hits, totalHits,total }; 
  } catch (error) {
    console.error(error); 
    throw  new Error; 
  }

  
}

