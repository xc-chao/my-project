export interface Image {
    storeName: string;
    name: string;
    color: string;
    size: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    image: string;
}

export interface Product {
    storeName: string;
    name: string;
    color: string;
    size: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    image: string;
}

export interface LikeProduct {
    name: string;
    price: number;
    description: string;
    sales: string;
    image: string;
    layout: string;
}