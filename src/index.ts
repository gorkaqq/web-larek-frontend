import { AppApi } from './components/AppApi';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { ProductsData } from './components/ProductsData';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';
import { IProduct, TOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { UserOrder } from './components/UserOrder';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const cardsContainer = new CardsContainer(document.querySelector('.gallery'));
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const cardCatalogTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement =
	document.querySelector('#card-basket');
const modalElement = ensureElement<HTMLElement>('#modal-container');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement =
	document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// events.onAll((event) => {
// 	console.log(event.eventName, event.data);
// });

const order = new UserOrder({}, events);
const catalog = new ProductsData(events);
const page = new Page(document.body, events);
const modal = new Modal(modalElement, events);

const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);

api
	.getProductList()
	.then((products) => {
		catalog.setItems(products);
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

events.on('initialData:loaded', () => {
	const cardsArray = catalog.getItems().map((card) => {
		const cardInstant = new Card(cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit('card:select', card),
		});
		return cardInstant.render(card);
	});
	cardsContainer.render({ catalog: cardsArray });
});

events.on('contacts:submit', () => {
	api
		.orderProducts(order.getOrderObj())
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					catalog.clearBasket();
					page.render({
						counter: 0,
					});
				},
			});

			modal.render({
				content: success.render({
					description: res.total,
				}),
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('card:addCart', (data: IProduct) => {
	catalog.addToCart(data.id);
	page.render({
		counter: catalog.getNumOfProductsInBasket(),
	});
	modal.close();
});

events.on('card:select', (data: IProduct) => {
	const selectedCard = new Card(cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => events.emit('card:addCart', data),
	});
	modal.render({
		content: selectedCard.render({
			category: data.category,
			image: data.image,
			description: data.description,
			title: data.title,
			price: data.price,
			inBasket: data.inBasket,
			id: data.id,
		}),
	});
});

events.on('productInBusket:delete', (data: Card) => {
	catalog.deleteFromCart(data.id);
	basketView.render({
		total: catalog.getSumInBasket(),
	});
	page.render({
		counter: catalog.getNumOfProductsInBasket(),
	});
});

// открыть корзину
events.on('cart:open', () => {
	const itemsInBasket = catalog
		.getItems()
		.filter((product) => product.inBasket === true)
		.map((item, index) => {
			const productInBasket = new Card(
				cloneTemplate(cardBasketTemplate),
				events
			);
			productInBasket.index = index + 1;
			return productInBasket.render({
				title: item.title,
				image: item.image,
				price: item.price,
				id: item.id,
			});
		});

	modal.render({
		content: basketView.render({
			items: itemsInBasket,
			total: catalog.getSumInBasket(),
		}),
	});
});

events.on('basket:order', () => {
	order.setOrderedItemsAndSum(
		catalog.getItemsInBasket().map((item) => item.id),
		catalog.getSumInBasket()
	);
	modal.render({
		content: orderForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof TOrderForm; value: string }) => {
		order.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof TOrderForm; value: string }) => {
		order.setOrderField(data.field, data.value);
	}
);

events.on('orderFormErrors:change', (errors: Partial<TOrderForm>) => {
	const { payment, address } = errors;
	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contactsFormErrors:change', (errors: Partial<TOrderForm>) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});
