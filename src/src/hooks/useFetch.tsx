import { useContext, useEffect, useState } from 'react';
import { ErrorContext } from '../App';
import request from '../utils/api';

const subscriptions: { [type: string]: (() => Promise<void>)[] } = {};

export const refresh = () => Object.keys(subscriptions).forEach(key => updateSubscribed(key));

export const updateSubscribed = (type: string) => {
	const callbacks = subscriptions[type];
	if (!callbacks) return;
	callbacks.forEach(cb => cb());
};

const useFetch = <T,>(type: string): null | T => {
	const { setError } = useContext(ErrorContext);
	const [data, setData] = useState<null | T>(null);

	const fetchData = async () => {
		const { data, error } = await request(type);
		if (error) return setError(`Error requesting ${type}!`);
		setData(data);
	};

	useEffect(() => {
		fetchData();
		if (!subscriptions[type]) subscriptions[type] = [];
		subscriptions[type].push(fetchData);
	}, []);

	return data;
};

export default useFetch;
