import compose from 'compose-function';
import { withRouter } from './with-router';
import { withQuery } from './with-query';

export const withProviders = compose(
  withRouter,
  withQuery,
);