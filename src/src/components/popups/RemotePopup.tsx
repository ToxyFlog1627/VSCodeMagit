import { FunctionComponent, useState } from 'react';
import InputPopup from './InputPopup';
import request from '../../utils/api';

type Props = { close: () => void };

// TODO: add options to remove and change remotes
const RemotePopup: FunctionComponent<Props> = ({ close }) => {
	const [name, setName] = useState<string | null>(null);

	const createRemote = async (name: string, url: string) => {
		const { error } = await request('createRemote', { name, url });
		if (error) return request('showError', `Couldn't create remote '${name}' with url '${url}'!`);
		close();
	};

	return name === null ? (
		<InputPopup close={close} label="Create new remote. Name" onInput={name => (name.length === 0 ? close() : setName(name))} />
	) : (
		<InputPopup close={close} label="Create new remote. Url" onInput={url => (url.length === 0 ? close() : createRemote(name, url))} />
	);
};

export default RemotePopup;
