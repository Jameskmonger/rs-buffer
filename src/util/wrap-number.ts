export const wrapNumber = (input: number, lowerBound: number, upperBound: number) => {
	if (input > upperBound) {
		input += lowerBound << 1;
	}

	if (input < lowerBound) {
		input -= lowerBound << 1;
	}

	return input;
};
