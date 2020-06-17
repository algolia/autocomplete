import percyHealthCheck from '@percy/cypress/task';

export default (on) => {
  on('task', percyHealthCheck);
};
