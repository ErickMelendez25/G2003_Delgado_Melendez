export const useAuth = () => ({
  login: vi.fn(() => Promise.resolve({ name: 'Usuario Mock' })),
  register: vi.fn(() => Promise.resolve({ name: 'Usuario Mock' })),
  logout: vi.fn(),
  user: { name: 'Usuario Mock' },
});
