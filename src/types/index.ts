export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	inBasket: boolean;
}

export interface IOrder {
	items: string[];
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
}

export interface ICatalog {
	setItems(items: IProduct[]): void;
	getItems(): IProduct[];
	addToCart(id: string): void;
	deleteFromCart(id: string): void;
	getSumInBasket(): number;
	getItemsInBasket(): IProduct[];
	getNumOfProductsInBasket(): number;
	clearBasket(): void;
}

export interface IAppState {
	preview: string | null;
	loading: boolean;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type TOrderForm = Pick<
	IOrder,
	'payment' | 'address' | 'email' | 'phone'
>;

export interface IOrderResult {
	total: number;
}

export type TOrderPayementInfo = Pick<IOrder, 'address' | 'payment'>;
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;
