import axios from 'axios';

const BASE_URL = 'https://pixabay.com';
const END_POINT = '/api/';
const API_KEY = '15968525-5a53092c6d62a7b9e458a529a';

export async function getImages(query, page = 1, perPage = 18) {

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const url = `${BASE_URL}${END_POINT}`;
  try {
    const res = await axios.get(url, {
      params: {
        key: API_KEY,
        image_type: 'photo',
        safesearch: true,
        orientation: 'horizontal',
        q: query,
        page: page,
        per_page: perPage,
      },
      headers: {
        ...headers
      }
    });
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