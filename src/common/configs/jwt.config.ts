export const jwtOptions = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
  accessExpiresIn: '15m',
  refreshExpiresIn: '7d',
}