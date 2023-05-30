import exec from "../exec";

export const pull = async (remote: string) => {
	const {error} = await exec(`git pull ${remote}`);
	if (error) return {error: true};
	return {data: null};
};
