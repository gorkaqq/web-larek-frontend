import { IProduct } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	protected events: IEvents;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _id: string;
	protected _category?: HTMLElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;
	protected _deleteButton?: HTMLElement;

	constructor(
		protected container: HTMLElement,
		events: IEvents,
		actions?: ICardActions
	) {
		super(container);
		this.events = events;

		this._category = this.container.querySelector('.card__category');
		this._description = this.container.querySelector('.card__text');
		this._price = this.container.querySelector('.card__price');
		this._image = this.container.querySelector('.card__image');
		this._title = this.container.querySelector('.card__title');
		this._button = this.container.querySelector('.button');
		this._index = this.container.querySelector('.basket__item-index');
		this._deleteButton = this.container.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}

		if (this._deleteButton) {
			this._deleteButton.addEventListener('click', () => {
				this.container.remove();
				this.events.emit('productInBusket:delete', this);
			});
		}
	}

	set price(price: number | null) {
		this.setText(this._price, price ? `${price} синапсов` : 'Не продается');

		if (this._button && !price) {
			this._button.disabled = true;
		}
	}

	set image(link: string) {
		this.setImage(this._image, link);
	}

	set category(category: string) {
		if (this._category) {
			switch (category) {
				case 'софт-скил':
					this._category.classList.add('card__category_soft');
					break;
				case 'другое':
					this._category.classList.add('card__category_other');
					break;
				case 'дополнительное':
					this._category.classList.add('card__category_additional');
					break;
				case 'кнопка':
					this._category.classList.add('card__category_button');
					break;
				case 'хард-скил':
					this._category.classList.add('card__category_hard');
					break;
				default:
					this._category.style.color = '#fff';
					break;
			}
			this.setText(this._category, category);
		}
	}

	set title(title: string) {
		this._title.textContent = title;
	}

	set inBasket(value: boolean) {
		if (!this._button.disabled) {
			this._button.disabled = value;
		}
	}

	set id(id) {
		this._id = id;
	}
	get id() {
		return this._id;
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}
}
