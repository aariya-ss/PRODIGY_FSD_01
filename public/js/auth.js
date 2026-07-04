// Core Authentication and API Client Operations

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed() {
  refreshSubscribers.forEach(cb => cb());
  refreshSubscribers = [];
}

/**
 * Custom Fetch Wrapper (Interceptor Pattern)
 * Intercepts expired Access Tokens, rotates them silently, and retries the original request.
 */
async function fetchAPI(url, options = {}) {
  options.headers = options.headers || {};
  
  if (!(options.body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
  }

  let res = await fetch(url, options);

  // If 401 Unauthorized, see if we can refresh the token
  if (res.status === 401) {
    let data;
    try {
      // Clone response to parse JSON without breaking stream
      data = await res.clone().json();
    } catch (e) {}

    if (data && data.code === 'TOKEN_EXPIRED') {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
          if (refreshRes.ok) {
            isRefreshing = false;
            onRefreshed();
            // Retry the original request
            return fetchAPI(url, options);
          } else {
            // Refresh token expired or was revoked
            isRefreshing = false;
            handleSessionExpiry();
            return res;
          }
        } catch (err) {
          isRefreshing = false;
          handleSessionExpiry();
          return res;
        }
      } else {
        // Queue the request until the refresh is complete
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(fetchAPI(url, options));
          });
        });
      }
    }
  }

  return res;
}

function handleSessionExpiry() {
  // Only redirect if we are not already on the login page
  if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
    window.location.href = '/login?expired=true';
  }
}

/**
 * Route Guard logic to verify authentication status and roles before showing a page.
 */
async function checkAuth(requiredRole = null) {
  try {
    const res = await fetchAPI('/api/auth/me');
    
    if (!res.ok) {
      // Not logged in
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return null;
    }

    const data = await res.json();
    const user = data.user;

    // Check Role-Based Access Control (RBAC)
    if (requiredRole && user.role !== requiredRole) {
      window.location.href = '/unauthorized';
      return null;
    }

    // If logged in and on the login page, redirect to dashboard
    if (window.location.pathname === '/' || window.location.pathname === '/login') {
      window.location.href = '/dashboard';
    }

    return user;
  } catch (err) {
    console.error('Error checking authorization:', err);
    if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return null;
  }
}

/**
 * Performs logout operation
 */
async function logout() {
  try {
    if (window.Loader) Loader.show();
    await fetch('/api/auth/logout', { method: 'POST' });
    if (window.Loader) Loader.hide();
    window.location.href = '/login';
  } catch (err) {
    console.error('Logout error:', err);
    if (window.Loader) Loader.hide();
    window.location.href = '/login';
  }
}

// Export to global scope
window.fetchAPI = fetchAPI;
window.checkAuth = checkAuth;
window.logout = logout;
