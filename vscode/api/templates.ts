import exec from '../exec';

type Command = string | ((argument: any) => string);

const getCommand = (command: Command, argument: any): string => (typeof command === 'string' ? command : command(argument));

export const execAndReturn =
	(command: Command, processData: (data: string) => any = data => data, ignoreError = false) =>
	async (argument: any) => {
		const { data, error } = await exec(getCommand(command, argument));
		if (!ignoreError && error) return { error: true };
		return { data: processData(data) };
	};

export const execWithoutReturn = (command: Command) => async (argument: any) => {
	const { error } = await exec(getCommand(command, argument));
	if (error) return { error: true };
	return { data: null };
};
