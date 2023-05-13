import { useEffect, useState } from 'react';
import request from '../utils/api';

const subscriptions: { [type: string]: (() => Promise<void>)[] } = {};

export const refresh = () => Object.keys(subscriptions).forEach(key => updateSubscribed(key));

export const updateSubscribed = (type: string) => {
	const callbacks = subscriptions[type];
	if (!callbacks) return;
	callbacks.forEach(cb => cb());
};

const useFetch = <T,>(type: string, { value, disableAutoRefetch }: { value?: any; disableAutoRefetch?: boolean } = {}): T | null => {
	const [data, setData] = useState<T | null>(null);

	const fetchData = async () => {
		const { data, error } = await request(type, value);
		if (error) {
			request('showError', `Error requesting ${type}!`);
			return;
		}

		setData(data);
	};

	useEffect(() => {
		fetchData();
		if (disableAutoRefetch) return;

		if (!subscriptions[type]) subscriptions[type] = [];
		subscriptions[type].push(fetchData);
	}, [type, value]);

	return data;
};

export default useFetch;
