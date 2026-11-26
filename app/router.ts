import { createRouter, type RouterContext } from 'remix/router'
import { render } from 'remix/middleware/render'

import controller from './actions/controller.tsx'
import framesController from './actions/frames/controller.tsx'
import { assets, publicFiles } from './assets.ts'
import { routes } from './routes.ts'

export const router = createRouter({
  middleware: [...(publicFiles ? [publicFiles] : []), render({ assets })],
})

export type AppContext = RouterContext<typeof router>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

router.map(routes, controller)
router.map(routes.frames, framesController)
