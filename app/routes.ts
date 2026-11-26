import { get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: get('/'),
  book: get('/:id'),
  notFound: get('*path'),
})
