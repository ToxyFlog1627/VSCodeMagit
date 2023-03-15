import {useContext, useEffect, useState} from "react";
import {ErrorContext} from "../App";
import request from "../utils/api";

const useFetch = <T,>(endpoint: string): [null | T, (value: T) => void, () => Promise<void>] => {
	const {setError} = useContext(ErrorContext);
	const [data, setData] = useState<null | T>(null);

	const fetchData = async () => {
		const {data, error} = await request(endpoint);
		if (error) return setError(`Error requesting ${endpoint}!`);
		setData(data);
	};

	useEffect(() => void fetchData(), []);

	return [data, setData, fetchData];
};

export default useFetch;
