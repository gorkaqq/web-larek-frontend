import { Component } from './base/Component';
import { ensureElement } from './../utils/utils';

interface ISuccess {
	description: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._description = this.container.querySelector(
			'.order-success__description'
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set description(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}
