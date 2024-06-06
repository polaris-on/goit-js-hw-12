export function createMarkup(data) {
    return data
      .map(
        ({
          id,
          webformatURL,
          largeImageURL,
          views,
          likes,
          comments,
          downloads,
          tags,
        }) => {
          return `
      <a href="${largeImageURL}" class="card">
         <img class="card__img" src="${webformatURL}" alt="${tags}" />
         <div class="card__info">
           <p class="card__numbers"><span>Views:</span> ${views}</p>
           <p class="card__numbers"><span>Likes:</span> ${likes}</p>
           <p class="card__numbers"><span>Comments:</span> ${comments}</p>
           <p class="card__numbers"><span>Downloads:</span> ${downloads}</p>
         </div>
      </a>
      `;
        }
      )
      .join('');
  }
  