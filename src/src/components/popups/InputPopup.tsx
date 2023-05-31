import { FunctionComponent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import Popup from './Popup';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	flex-direction: row;
`;

const Label = styled.label`
	margin-right: 5px;
	min-width: fit-content;
`;

const Input = styled.input`
	background: none;
	border: none;
	outline: none !important;
	color: var(--vscode-editorHoverWidget-foreground);
	width: 100%;
`;

type Props = {
	close: (value: boolean) => void;
	onInput: (value: string) => void;
	initialValue?: string;
	label: string;
};

const InputPopup: FunctionComponent<Props> = ({ close, onInput, initialValue = '', label }) => {
	const [value, setValue] = useState(initialValue);
	const inputRef = useRef(null);

	useEffect(() => {
		if (!inputRef.current) return;
		setTimeout(() => (inputRef.current! as HTMLElement).focus(), 50);
	}, [inputRef]);

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter') return;
		if (value === '') return close(false);
		onInput(value);
		setValue('');
		close(true);
	};

	return (
		<Popup close={close}>
			<Container>
				<Label>{label} (leave empty to abort):</Label>
				<Input id="input" ref={inputRef} value={value} onKeyDown={onKeyDown} onChange={event => setValue((event.target as HTMLInputElement).value)} onClick={event => event.stopPropagation()} />
			</Container>
		</Popup>
	);
};

export default InputPopup;
