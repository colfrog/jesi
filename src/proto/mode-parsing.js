// Currently supported IRC privileged modes in order
const privileges = 'vhoaqY';

export function hasAtLeast(modeString, mode) {
	if (mode.length > 1 || modeString.length === 0)
		return false;

	let modes = privileges.slice(privileges.indexOf(mode));
	for (let i = 0; i < modeString.length; i++)
		if (privileges.includes(modeString[i]))
			return true;

	return false;
}
