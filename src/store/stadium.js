import { writable } from 'svelte/store'

const state = {
	stadiums: {},
    isBoy: false,
    isGirl: false,
    isSick: false,
}

function createStadiumStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
		setStadiums(entry) {
			const key = Object.keys(entry)[0]
			const value = Object.values(entry)[0]
			console.log('key: ', key)
			console.log('value: ',value)
			update((state) => {
				let x = { ...state };
      			x.stadiums[key] = value
				return x
			})
		},
        setIsBoy() {
            console.log('*: playerStore -> setIsBoy()')
            update((state) => ({ ...state, isBoy: true, isGirl: false }))
        },

        setIsGirl() {
            console.log('*: playerStore -> setIsGirl()')
            update((state) => ({ ...state, isBoy: false, isGirl: true }))
        },

        toggleIsSick() {
            console.log('*: playerStore -> toggleIsSick()')
            update((state) => ({ ...state, isSick: !state.isSick }))
        },
    }

    return {
        subscribe,
        ...methods,
    }
}

// export default store()
export const stadiumStore = createStadiumStore()

// export const stadiumStore = writable([]);

// function createStadiumStore() {
//     const { subscribe, set, update } = writable([])

//     return {
//         subscribe,
//         setStadium: (object) => set(object),
//         // setStadium: (object) => {}
//         // setStadium: (object) => {
//         //     update(store => {
//         //         return [...store, { white_move: 'a1-a2', black_move: ''}]
//         //     })
//         // },
//     }
// }

// export const stadiumStore = createStadiumStore()
