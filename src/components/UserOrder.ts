import { Model } from './base/Model';
import { FormErrors, IAppState, IOrder, TOrderForm } from '../types';

export class UserOrder extends Model<IAppState> {
	order: IOrder = {
		email: '',
		payment: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
	};

	formErrors: FormErrors = {};

	setOrderedItemsAndSum(id: string[], sum: number) {
		this.order.items = id;
		this.order.total = sum;
	}
	getOrderObj() {
		return this.order;
	}

	setOrderField(field: keyof TOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrderForm()) {
			this.events.emit('orderForm:ready', this.order);
		}

		if (this.validateContactsForm()) {
			this.events.emit('orderContacts:ready', this.order);
		}
	}

	validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrderForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrder() {
		this.order = {
			email: '',
			payment: '',
			phone: '',
			address: '',
			items: [],
			total: 0,
		};
	}
}
