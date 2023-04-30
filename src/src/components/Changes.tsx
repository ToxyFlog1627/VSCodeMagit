import {FunctionComponent} from "react";
import styled from "styled-components";
import Group from "../components/Group";

const Column = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const TextContainer = styled(Column)`
	background: var(--vscode-button-hoverBackground);
	color: var(--vscode-editor-foreground);
	width: 100vw;
	border: none;
	border-radius: 2px;
`;

const Hunk = styled(Column)`
	background: var(--vscode-button-background);
`;

const Line = styled.p<{children: string}>`
	white-space: pre;
	color: ${({children}) => (children[0] === "+" ? "var(--vscode-gitDecoration-addedResourceForeground)" : children[0] === "-" ? "var(--vscode-gitDecoration-deletedResourceForeground)" : "inherit")};
	background: ${({children}) => (children[0] === "+" ? "#00FF0020" : children[0] === "-" ? "#FF000020" : "#00000000")};
	width: 100%;
	padding: 1px;
`;

const getFileChangeDescription = (from: string, to: string) => {
	if (to === "/dev/null") return `deleted ${from}`;
	if (from === "/dev/null") return `created ${to}`;
	if (from !== to) return `renamed ${from} -> ${to}`;
	return `modified ${to}`;
};

export type Diff = {
	from: string;
	to: string;
	hunks: string[][];
}[];

type Props = {
	title: string;
	changes: Diff;
};

const Changes: FunctionComponent<Props> = ({title, changes}) => (
	<Group title={title} section>
		<Column>
			{changes.map(({from, to, hunks}) =>
				hunks.length > 0 ? (
					<Group title={getFileChangeDescription(from, to)} isOpened={false}>
						<TextContainer>
							{hunks.map(lines => (
								<Group title={lines[0]}>
									<Hunk>
										{lines.slice(1, -1).map(line => (
											<Line>{line}</Line>
										))}
									</Hunk>
								</Group>
							))}
						</TextContainer>
					</Group>
				) : (
					<p>{getFileChangeDescription(from, to)}</p>
				)
			)}
		</Column>
	</Group>
);

export default Changes;
