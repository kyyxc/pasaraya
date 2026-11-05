export const CART_STORAGE_KEY = 'pasaraya_cart';

export function getCartItems() {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveCartItems(items) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function getCartCount() {
    return getCartItems().reduce((total, item) => total + Number(item.qty || 0), 0);
}

export function addProductToCart(product) {
    const items = getCartItems();
    const productId = Number(product?.id ?? 0);
    const existingIndex = items.findIndex((item) => Number(item.id) === productId);

    if (existingIndex >= 0) {
        items[existingIndex] = {
            ...items[existingIndex],
            qty: Number(items[existingIndex].qty || 0) + 1,
        };
    } else {
        items.push({
            id: productId,
            name: product?.name ?? 'Produk',
            seller: product?.seller ?? product?.store_name ?? 'Pasaraya',
            price: Number(product?.price ?? 0),
            image: product?.image ?? product?.images?.[0]?.image ?? '/images/producs/image_1.webp',
            qty: 1,
        });
    }

    saveCartItems(items);
    return items;
}

export function updateCartItemQuantity(productId, nextQty) {
    const items = getCartItems()
        .map((item) => (Number(item.id) === Number(productId) ? { ...item, qty: Math.max(1, Number(nextQty) || 1) } : item))
        .filter((item) => Number(item.qty) > 0);

    saveCartItems(items);
    return items;
}

export function removeCartItem(productId) {
    const items = getCartItems().filter((item) => Number(item.id) !== Number(productId));
    saveCartItems(items);
    return items;
}
