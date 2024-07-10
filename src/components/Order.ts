import { Form } from './common/Form';
import { TOrderPayementInfo } from '../types';
import { IEvents } from './base/events';

export class Order extends Form<TOrderPayementInfo> {
	protected card: HTMLButtonElement;
	protected cash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.card = this.container.elements.namedItem('card') as HTMLButtonElement;
		this.cash = this.container.elements.namedItem('cash') as HTMLButtonElement;

		if (this.card) {
			this.card.addEventListener('click', () => {
				this.card.classList.add('button_alt-active');
				this.cash.classList.remove('button_alt-active');
				this.onInputChange('payment', 'Онлайн');
			});
		}

		if (this.cash) {
			this.cash.addEventListener('click', () => {
				this.cash.classList.add('button_alt-active');
				this.card.classList.remove('button_alt-active');
				this.onInputChange('payment', 'При получении');
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
