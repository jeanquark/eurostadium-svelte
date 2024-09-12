import { writable } from 'svelte/store';

function createCounter() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update((n) => n + 1),
		decrement: () => update((n) => n - 1),
		reset: () => set(0)
	};
}

export const counter = createCounter();


// import { writable } from 'svelte/store'

// export const countStore = writable({
//     value: 0
// })

// export const count = writable(0);

// export const countHandlers = {
//     increaseCount: () => {
//         const newValue = countStore
//         console.log('newValue: ', newValue);
//         countStore.set({value: 2 })
//         console.log('countStore.value: ', countStore.value)
//     }
// }