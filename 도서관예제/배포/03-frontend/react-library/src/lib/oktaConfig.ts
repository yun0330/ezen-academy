export const oktaConfig = {
    clientId: '0oaikpn980NiFOvpx5d7',
    issuer: 'https://dev-69510226.okta.com',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}