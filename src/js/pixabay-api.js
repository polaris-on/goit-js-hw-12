import axios from 'axios';

const BASE_URL = 'https://pixabay.com';
const END_POINT = '/api/';
const API_KEY = '15968525-5a53092c6d62a7b9e458a529a';

export async function getImages(query) {
  const params = new URLSearchParams({
    key: API_KEY,
    image_type: 'photo',
    safesearch: true,
    orientation: 'horizontal',
    q: query,
  }).toString();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Referrer-Policy': 'no-referrer',
    'X-Requested-With': 'XMLHttpRequest',
  };
  const url = `${BASE_URL}${END_POINT}?${params}`;
  try {
    const res = await axios.get(url, headers);
    return res.data;
  } catch (error) {
    if (error.response) {
      iziToast.error({
        title: 'Error',
        message: `HTTP error! status: ${error.response.status} - ${error.response.statusText}`,
      });
    } else {
      iziToast.error({
        title: 'Error',
        message: error.message,
      });
    }
    return;
  }
}