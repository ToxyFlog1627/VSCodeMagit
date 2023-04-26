import {FunctionComponent} from "react";
import styled from "styled-components";
import Group from "../components/Group";

const Column = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

// TODO: colorscheme-dependent colors + make text in edited line be correctly colored.

const TextContainer = styled(Column)`
	background: #f0ff0f;
	color: var(--vscode-foreground);
	width: 100vw;
	border: none;
	border-radius: 2px;
`;

const TextColumn = styled(Column)`
	overflow-x: hidden;
	background: var(--vscode-dropdown-background);
`;

const Line = styled.p<{type: string}>`
	white-space: pre;
	color: ${({type}) => (type === "+" ? "#0ec930" : type === "-" ? "#c91515" : "#ffffff")};
	background: ${({type}) => (type === "+" ? "#00FF0018" : type === "-" ? "#FF000018" : "#00000000")};
	width: 100%;
	padding: 1px;
`;

export type Diff = {
	from: string;
	to: string;
	hunks: string[][];
}[];

const getFileChangeDescription = (from: string, to: string) => {
	if (to === "/dev/null") return `deleted ${from}`;
	if (from !== to) return `renamed ${from} -> ${to}`;
	return `modified ${to}`;
};

type Props = {
	title: string;
	changes: Diff;
};

const Changes: FunctionComponent<Props> = ({title, changes}) => (
	<Group title={title} section>
		<Column>
			{changes.map(({from, to, hunks}) => (
				<Group title={getFileChangeDescription(from, to)} isOpened={false}>
					<TextContainer>
						{hunks.map(hunk => (
							<Group title={hunk[0]}>
								<TextColumn>
									{hunk.slice(1, -1).map(line => (
										<Line type={line[0]}>{line}</Line>
									))}
								</TextColumn>
							</Group>
						))}
					</TextContainer>
				</Group>
			))}
		</Column>
	</Group>
);

export default Changes;
