import { ICatalog, IProduct } from '../types';
import { IEvents } from './base/events';

export class ProductsData implements ICatalog {
	protected _items: IProduct[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	setItems(items: IProduct[]): void {
		this._items = items;
		this.events.emit('items:changed');
	}

	getItems(): IProduct[] {
		return this._items;
	}

	addToCart(id: string) {
		this._items.find((item) => item.id === id).inBasket = true;
	}

	deleteFromCart(id: string) {
		this._items.find((item) => item.id === id).inBasket = false;
	}

	getSumInBasket() {
		return this.getItemsInBasket().reduce((acc, sum) => acc + sum.price, 0);
	}

	getItemsInBasket() {
		return this._items.filter((item) => item.inBasket === true);
	}

	getNumOfProductsInBasket() {
		return this.getItemsInBasket().length;
	}

	clearBasket() {
		this._items.forEach((item) => (item.inBasket = false));
	}
}
