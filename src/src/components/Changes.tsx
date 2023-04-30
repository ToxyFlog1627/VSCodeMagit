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

const Line = styled.p<{type: string}>`
	white-space: pre;
	color: ${({type}) => (type === "+" ? "var(--vscode-gitDecoration-addedResourceForeground)" : type === "-" ? "var(--vscode-gitDecoration-deletedResourceForeground)" : "inherit")};
	background: ${({type}) => (type === "+" ? "#00FF0020" : type === "-" ? "#FF000020" : "#00000000")};
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
			{changes.map(({from, to, hunks}) =>
				hunks.length > 0 ? (
					<Group title={getFileChangeDescription(from, to)} isOpened={false}>
						<TextContainer>
							{hunks.map(hunk => (
								<Group title={hunk[0]}>
									<Hunk>
										{hunk.slice(1, -1).map(line => (
											<Line type={line[0]}>{line}</Line>
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
