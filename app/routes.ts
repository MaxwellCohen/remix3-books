import { get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: get('/'),
  // Route-owned regions of the home page, streamed into it with <Frame>.
  frames: route('/frames', {
    books: get('/books'),
    count: get('/count'),
  }),
  book: get('/:id'),
  notFound: get('*path'),
})
