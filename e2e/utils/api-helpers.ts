import { APIRequestContext } from '@playwright/test';


const API_URL = process.env.API_URL || 'http://localhost:8080/api';


/**
 * API helper functions for test setup and teardown
 */

/**
 * Login via API and get JWT token
 */
export async function loginViaApi(
  request: APIRequestContext,
  username: string,
  password: string
): Promise<string> {
  const response = await request.post(`${API_URL}/auth/login`, {
    data: { username, password },
  });

  if (!response.ok())
    throw new Error(`Login failed: ${response.status()} ${response.statusText()}`);

  const data = await response.json();

  return data.token;
}

/**
 * Register new user via API
 */
export async function registerViaApi(
  request: APIRequestContext,
  userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
): Promise<any> {
  const response = await request.post(`${API_URL}/auth/register`, {
    data: userData,
  });

  if (!response.ok()) {
    const error = await response.json();

    throw new Error(`Registration failed: ${error.message || response.statusText()}`);
  }

  return response.json();
}

/**
 * Get car details via API
 */
export async function getCarById(
  request: APIRequestContext,
  carId: number
): Promise<any> {
  const response = await request.get(`${API_URL}/cars/${carId}`);

  if (!response.ok())
    throw new Error(`Failed to get car: ${response.status()}`);

  return response.json();
}

/**
 * Search cars via API
 */
export async function searchCars(
  request: APIRequestContext,
  params: Record<string, any> = {}
): Promise<any> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value))
        value.forEach(v => searchParams.append(key, v.toString()));
      else
        searchParams.set(key, value.toString());
    }
  });

  const response = await request.get(`${API_URL}/cars/search?${searchParams.toString()}`);

  if (!response.ok())
    throw new Error(`Search failed: ${response.status()}`);

  return response.json();
}

/**
 * Create a review via API (requires auth)
 */
export async function createReview(
  request: APIRequestContext,
  token: string,
  carId: number,
  reviewData: object
): Promise<any> {
  const response = await request.post(`${API_URL}/reviews/${carId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: reviewData,
  });

  if (!response.ok()) {
    const error = await response.json();

    throw new Error(`Failed to create review: ${error.message || response.statusText()}`);
  }

  return response.json();
}

/**
 * Create a fuel report via API (requires auth)
 */
export async function createFuelReport(
  request: APIRequestContext,
  token: string,
  carId: number,
  reportData: object
): Promise<any> {
  const response = await request.post(`${API_URL}/fuel-reports/${carId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: reportData,
  });

  if (!response.ok()) {
    const error = await response.json();

    throw new Error(`Failed to create fuel report: ${error.message || response.statusText()}`);
  }

  return response.json();
}

/**
 * Get brands via API
 */
export async function getBrands(request: APIRequestContext): Promise<any[]> {
  const response = await request.get(`${API_URL}/brands`);

  if (!response.ok())
    throw new Error(`Failed to get brands: ${response.status()}`);

  return response.json();
}

/**
 * Get user profile via API (requires auth)
 */
export async function getProfile(
  request: APIRequestContext,
  token: string
): Promise<any> {
  const response = await request.get(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok())
    throw new Error(`Failed to get profile: ${response.status()}`);

  return response.json();
}
