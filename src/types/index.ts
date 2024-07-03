export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IOrder {
	payment: TPaymentMethod;
	address: string;
	email: string;
	phone: string;
}

export interface IBasket {
	items: string[];
	total: number;
	addItem(item: IProduct): void;
	removeItem(itemId: string): void;
	getItems(): IProduct[];
}

export interface ICatalog {
	_items: IProduct[];
	setItems(items: IProduct[]): void;
	getItems(): IProduct[];
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IModalData {
	content: HTMLElement;
}

export type TOrderPayementInfo = Pick<IOrder, 'address' | 'payment'>;
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;
export type TPaymentMethod = 'Онлайн' | 'При получении';

export type TCardCatalog = Pick<
	IProduct,
	'category' | 'title' | 'image' | 'price'
>;
export type TCardPreview = Pick<
	IProduct,
	'image' | 'category' | 'description' | 'price' | 'title'
>;
export type TCardBasket = Pick<IProduct, 'title' | 'price'>;
