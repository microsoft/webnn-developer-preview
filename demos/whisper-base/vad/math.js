export function gcd(a, b) {
	// Greatest common divisor of 2 integers
	if (!b) {
		return b === 0 ? a : NaN;
	}
	return gcd(b, a % b);
}


export function lcm(a, b) {
	// Least common multiple of 2 integers
	return a * b / gcd(a, b);
}
