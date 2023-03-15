import {FunctionComponent, ReactNode, useState} from "react";
import styled from "styled-components";
import Caret from "./Caret";

const Container = styled.div<{indented: boolean}>`
	position: relative;
	${({indented}) => indented && "margin-left: 14px; margin-bottom: 3px;"}
`;

const Title = styled.p<{highlightTitle: boolean}>`
	${({highlightTitle}) => highlightTitle && "color: var(--vscode-editorLink-activeForeground); font-weight: bolder;"}
`;

const Content = styled.div`
	display: flex;
	flex-direction: row;
`;

type Props = {
	title: string;
	children?: ReactNode;
	opened?: boolean;
	section?: boolean;
};

const Group: FunctionComponent<Props> = ({title, children, opened: _opened = true, section = false}) => {
	const [opened, setOpened] = useState(_opened);

	return (
		<Container indented={section}>
			<Caret setOpened={setOpened} opened={opened} />
			<Title highlightTitle={section}>{title}</Title>
			{opened && <Content>{children}</Content>}
		</Container>
	);
};

export default Group;
