import { writable } from 'svelte/store'
import { db } from '../lib/firebase/firebase'
import { collection, query, where, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'

const state = {
    leagues: [],
}

function createLeagueStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        async fetchLeagues() {
            console.log('[LeagueStore] fetchLeagues');
            const querySnapshot = await getDocs(collection(db, 'leagues'))
            console.log('[LeagueStore Firebase] querySnapshot: ', querySnapshot);
            const array = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                array.push(doc.data())
            })
            // console.log('array: ', array)
            this.leagues = array
        },
    }

    return {
        subscribe,
        ...methods,
    }
}

export const leagueStore = createLeagueStore()
