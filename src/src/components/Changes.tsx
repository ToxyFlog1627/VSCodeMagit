import {FunctionComponent} from "react";
import styled from "styled-components";
import Group from "../components/Group";

const Column = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const CodeContainer = styled(Column)`
	color: var(--vscode-foreground);
	background: var(--vscode-dropdown-background);
	width: 100vw;
	border: none;
	border-radius: 2px;
`;

const Line = styled.p<{type: string}>`
	white-space: pre;
	background: ${({type}) => (type === "+" ? "#00FF0018" : type === "-" ? "#FF000018" : "#00000000")};
	width: 100%;
	padding: 1px;
`;

type Props = {
	title: string;
	changes: [string, string, string[][]][];
};

const Changes: FunctionComponent<Props> = ({title, changes}) => (
	<Group title={title} section>
		<Column>
			{changes.map(([action, filename, hunks]) => (
				<Group title={action + " " + filename} opened={false}>
					<CodeContainer>
						{hunks.map(hunk => (
							<Group title={hunk[0]}>
								<Column style={{overflowX: "hidden"}}>
									{hunk.slice(1, -1).map(line => (
										<Column>
											<Line type={line[0]}>{line}</Line>
										</Column>
									))}
								</Column>
							</Group>
						))}
					</CodeContainer>
				</Group>
			))}
		</Column>
	</Group>
);

export default Changes;
