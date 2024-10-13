import { writable } from "svelte/store";
import { db } from "../lib/firebase/firebase";
import {
    collection,
    query,
    where,
    orderBy,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

const state = {
	stadiums: {},
    isBoy: false,
    isGirl: false,
    isSick: false,
}

function createStadiumStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        async fetchStadiumsByCountry(country) {
            console.log('[StadiumStore] fetchStadiumsByCountry country: ', country);

            // // 1) Fetch from Firestore
            // const stadiumsRef = collection(db, `countries/${country}/stadiums`)
            // const q = query(stadiumsRef, orderBy('venue.capacity', 'asc'))
            // const querySnapshot = await getDocs(q)

            // console.log('[Firebase call] StadiumStore querySnapshot: ', querySnapshot)
            // const array = []
            // querySnapshot.forEach((doc) => {
            //     array.push(doc.data())
            // })

            // 2) Or fetch from local json file
            const array = []
            const response = await fetch(`json/teams/${country}.json`);
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            console.log('data: ', data);
            console.log('array: ', array)

            this.setStadiums({ [country]: array })
        },
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
