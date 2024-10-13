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

            // // 1) Fetch from Firestore
            // const querySnapshot = await getDocs(collection(db, 'leagues'))
            // console.log('[Firebase call] LeagueStore querySnapshot: ', querySnapshot);
            // const array = []
            // querySnapshot.forEach((doc) => {
            //     array.push(doc.data())
            // })
            // this.leagues = array

            // 2) Or fetch from local json file
            const array = []
            const response = await fetch(`json/leagues.json`);
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            this.leagues = array
        },
    }

    return {
        subscribe,
        ...methods,
    }
}

export const leagueStore = createLeagueStore()
