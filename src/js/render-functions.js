
export function renderMarkup(hits, gallery) {
  const markup = hits.map(hit => `
    <a href="${hit.largeImageURL}" class="gallery-item">
      <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
      <ul class="info">
        <li><p>Likes</p> ${hit.likes}</li>
        <li><p>Views</p> ${hit.views}</li>
        <li><p>Comments</p> ${hit.comments}</li>
        <li><p>Downloads</p> ${hit.downloads}</li>
      </ul>
    </a>`).join(``);

  gallery.insertAdjacentHTML('beforeend', markup);
}



