import ky from "ky";

export async function fetcher<T>(url: string, options?: any): Promise<T> {
  try {
    const response = await ky(url, {
      timeout: 5000,
      retry: 2,
      ...options,
    }).json<T>();
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }
}
