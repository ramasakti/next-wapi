// Mengambil nilai header dari environment variable
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'x-app-id': process.env.NEXT_PUBLIC_APP_ID || '',
};

// Mengambil base URL dari environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''; // Misalnya: 'https://api.example.com'

/**
 * Fungsi untuk melakukan fetch dengan URL dan header yang distandarisasi.
 * @param {string} route - Route yang ingin diakses, misalnya '/users'.
 * @param {Object} options - Opsi fetch tambahan, seperti method, headers, dll.
 * @param {Object} [options.params] - Parameter query untuk ditambahkan ke URL.
 * @param {string} [options.token] - Token otentikasi.
 * @param {boolean} [options.isBlob] - Mengatur jika response type adalah blob.
 * @returns {Promise} - Mengembalikan hasil fetch dalam bentuk JSON atau Blob.
 */
export async function fetcher(route, options = {}) {
    const { params, token, isBlob, ...fetchOptions } = options;

    // Menyusun URL penuh dengan menggabungkan base URL dan route
    let url = `${BASE_URL}${route}`;

    // Jika ada parameter query, tambahkan ke URL
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
    }

    // Menyusun headers
    const headers = {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`, // Menyertakan token otentikasi jika ada
        ...fetchOptions.headers,
    };

    // Menghapus 'Content-Type' jika body adalah FormData karena fetch secara otomatis akan menanganinya
    if (fetchOptions.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const response = await fetch(url, {
        ...fetchOptions,
        headers: headers,
    });

    // Jika response type adalah blob, kembalikan sebagai blob
    if (isBlob) {
        const blob = await response.blob();
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`);
        }
        return blob;
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Fetch error: ${response.statusText}`);
    }

    return data;
}
