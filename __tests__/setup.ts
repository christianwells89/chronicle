import '@testing-library/jest-dom';

// mock all instances of the router (including when used by Links)
// eslint-disable-next-line global-require
jest.mock('next/dist/client/router', () => require('next-router-mock'));
