import {useContext, useEffect, useState} from "react";
import {ErrorContext} from "../App";
import request from "../utils/api";

const subscriptions: {[endpoint: string]: (() => Promise<void>)[]} = {};

export const updateSubscribed = (endpoint: string) => {
	const callbacks = subscriptions[endpoint];
	if (!callbacks) return;
	callbacks.forEach(cb => cb());
};

const useFetch = <T,>(endpoint: string): [null | T, (value: T) => void, () => Promise<void>] => {
	const {setError} = useContext(ErrorContext);
	const [data, setData] = useState<null | T>(null);

	const fetchData = async () => {
		const {data, error} = await request(endpoint);
		if (error) return setError(`Error requesting ${endpoint}!`);
		setData(data);
	};

	useEffect(() => {
		fetchData();
		if (!subscriptions[endpoint]) subscriptions[endpoint] = [];
		subscriptions[endpoint].push(fetchData);
	}, []);

	return [data, setData, fetchData];
};

export default useFetch;
