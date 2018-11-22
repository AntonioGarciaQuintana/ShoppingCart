import { Document } from './document';


export class Product {
    id: number;
    name: string;
    active: boolean;
    author: string;
    category: string;
    description: string;
    imageUrl: string;
    isbn: string;
    price: number;
    registerDate: Date;
    stock: number;
    title: string;
    document: Document;
    classification: number;
    genre: number;
}
