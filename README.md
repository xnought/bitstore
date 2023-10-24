# bitstore

Memory efficient bit arrays. Instead of a whole 32 bit integer only storing one bit (1 or 0), use bitwise ops to store 32 bits in that one int.


```js
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
```

The results are 

```txt
mask: 84.106ms
Storing 1 billion bits in a 31.25 million length Uint32Array
```

Implemented from scratch for educational purposes, but initially inspired from https://github.com/cmudig/falcon-vis/blob/main/falcon-vis/src/bitset.ts