function getBitIndex(arr, i, intWidth) {
	const intIndex = Math.floor(i / intWidth);
	if (intIndex >= arr.length) throw Error("Index out of bounds");
	const int = arr[intIndex];
	// 1 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 1
	//                                 ^ would be int 1, i=14
	const localIndex = i % intWidth;
	return [int, intIndex, localIndex];
}
function getBit(arr, i, intWidth) {
	// figure out which integer our bit is being held in
	const [int, _, localIndex] = getBitIndex(arr, i, intWidth);
	const shifted = int >>> (intWidth - 1 - localIndex);
	return shifted & 1;
}
function setBit(arr, i, bit, intWidth) {
	const [_, intIndex, localIndex] = getBitIndex(arr, i, intWidth);
	const m = 1 << (intWidth - localIndex - 1);
	if (bit === 1) {
		arr[intIndex] |= m;
	} else {
		arr[intIndex] &= ~m;
	}
}

class BitStore {
	constructor(maxBits = 32, UIntArray = Uint32Array) {
		this.UIntArray = UIntArray;
		this.intWidth = this.UIntArray.BYTES_PER_ELEMENT * 8;
		this.maxBits = maxBits;
		this.numInts = Math.ceil(this.maxBits / this.intWidth);
		this.data = new this.UIntArray(this.numInts);
	}
	set(i, bit) {
		if (i >= this.maxBits) throw Error("Index out of range");
		setBit(this.data, i, bit, this.intWidth);
	}
	get(i) {
		if (i >= this.maxBits) throw Error("Index out of range");
		return getBit(this.data, i, this.intWidth);
	}
	and(other) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] &= other.data[i];
		}
		return this;
	}
	or(other) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] |= other.data[i];
		}
		return this;
	}
	xor(other) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] ^= other.data[i];
		}
		return this;
	}
	not() {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] = ~this.data[i];
		}
		return this;
	}
	rshift(num) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] = this.data[i] >> num;
		}
		return this;
	}
	lshift(num) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] = this.data[i] << num;
		}
		return this;
	}
	copy() {
		const _copy = new BitStore(this.maxBits, this.UIntArray);
		for (let i = 0; i < this.data.length; i++) {
			_copy.data[i] = this.data[i];
		}
		return _copy;
	}
	fill(bit) {
		this.data.fill(bit);
		return this;
	}
	get bytes() {
		return this.data.BYTES_PER_ELEMENT * this.data.length;
	}
	*[Symbol.iterator]() {
		for (let i = 0; i < this.maxBits; i++) {
			yield this.get(i);
		}
	}
}

const n = 1_000_000_000;
const b = new BitStore(n);
const mask = new BitStore(n).fill(1);

console.time("mask");
b.and(mask);
console.timeEnd("mask");

console.log(
	`Storing 1 billion bits in a ${
		b.data.length / 1e6
	} million length Uint32Array`
);
