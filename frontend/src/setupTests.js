import { vi } from 'vitest';
// src/setupTests.js
import '@testing-library/jest-dom';


vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../__mocks__/useAuth.js');
  return { useAuth: actual.useAuth };
});
