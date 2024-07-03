# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Товар

```
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
```

Заказ

```
export interface IOrder {
	payment: TPaymentMethod;
	address: string;
	email: string;
	phone: string;
}
```

Интерфейс для модели данных корзины

```
export interface IBasket {
	items: string[];
	total: number;
	addItem(item: IProduct): void;
	removeItem(itemId: string): void;
	clearBasket(): void;
	getItems(): IProduct[];
}
```

Интерфейс для модели данных каталога

```
export interface ICatalog {
	_items: IProduct[];
	setItems(items: IProduct[]): void;
	getItems(): IProduct[];
}
```

Данные пользователя, используемые в форме при выборе типа оплаты и адреса доставки

```
export type TUserPayementInfo = Pick<IUser, 'address' | 'payment'>;
```

Данные пользователя, используемые в форме при заполнении полей почты и телефона

```
export type TUserContactInfo = Pick<IUser, 'email' | 'phone'>;
```

Способ оплаты пользователя

```
export type TPaymentMethod = 'Онлайн' | 'При получении';
```

Данные товара на главной странице

```
export type TCardCatalog = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;
```

Данные товара в превью товара

```
export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description' | 'price' | 'title'>;
```

Данные товара в форме корзины

```
export type TCardCatalog = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс Catalog

Класс отвечает за хранение и логику работы с данными массива товаров.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:

- \_items: IProduct[] - массив объектов товаров

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- setItems(items: IProduct[]): void - заполнить каталог.
- getItems(): IProduct[] - получить каталог.

#### Класс Basket

Класс отвечает за хранение и логику работы с данными текущего пользователя.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:

- items: string[] - список идентификаторов товаров в корзине;
- total: number - сумма купленных товаров;
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- addItem(item: IProduct): void - добавить товар в корзину;
- removeItem(itemId: string): void - удалить товар из корзины;
- getItems(): IProduct[] - получить список товаров в корзине.

### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый Класс Component

Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

#### Класс Modal

Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.

- constructor(container: HTMLElement, events: IEvents) Конструктор принимает контейнер модального окна и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса содержат кнопку закрытия модального окна и элекменгт разметки размещающийся в модальном окне.

#### Класс Card

Отвечает за отображение карточки товара, задавая в карточке данные названия, изображения, категории, описания, цены. Класс используется для отображения карточек товаров на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы:

- геттер \_id возвращает уникальный id карточки

#### Класс Page

Отвечает за отображение блока с карточками на главной странице, количества товаров в корзине, состояния блокировки прокрутки страницы. В конструктор принимает контейнер, в котором размещаются карточки и эземпляр `EventEmitter` для инициации событий. Поля класса содержат элементы разметки страницы.

#### Класс Form

Отвечает за отображение блока с формой в модальном окне. В конструктор принимает контейнер формы и экземпляр `EventEmitter` для инициации событий. Поля класса содержат элементы кнопки сабмита и ошибок валидации.

### Слой коммуникации

#### Класс AppApi

Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

_Список всех событий, которые могут генерироваться в системе:_\
_События изменения данных (генерируются классами моделями данных)_

- `order:changed` - изменение данных заказа
- `items:changed` - изменение массива товаров в корзине
- `item:selected` - изменение открываемой в модальном окне карточки товара

_События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)_

- `item:select` - выбор карточки для отображения в модальном окне
- `modal:open` - открытие модального окна
- `item:delete` - выбор карточки для удаления из корзины
- `edit-form:input` - изменение данных в форме
- `edit-modal:submit` - сохранение данных заказа в модальном окне
- `edit-form:validation` - событие, сообщающее о необходимости валидации формы
