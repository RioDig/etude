// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import compose from 'compose-function'
import { withRouter } from './with-router'
import { withQuery } from './with-query'
import { withAuth } from "./with-auth"

export const withProviders = compose(
  withQuery,
  withRouter,
  withAuth,

)