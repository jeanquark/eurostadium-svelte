import { writable } from 'svelte/store';

// export const stadiumStore = writable([]);

function createStadiumStore() {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,
		setStadium: (object) => set(object)
		// setStadium: (object) => {}
		// setStadium: (object) => {
        //     update(store => {
        //         return [...store, { white_move: 'a1-a2', black_move: ''}]
        //     })
        // },
	};
}

export const stadiumStore = createStadiumStore();