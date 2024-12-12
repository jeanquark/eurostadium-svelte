import { writable } from 'svelte/store'
import { supabase } from "../lib/supabase/supabaseClient";
// let { supabase } = $props()
// import data from '../routes/+layout.js'
// const { supabase } = data 

const state = {
    leagues: [],
}

function createLeagueStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        async fetchLeagues() {
            console.log('[Store] fetchLeagues');

            // 1) Fetch from Firestore
            // const querySnapshot = await getDocs(collection(db, 'leagues'))
            // console.log('[Firebase call] LeagueStore querySnapshot: ', querySnapshot);
            // const array = []
            // querySnapshot.forEach((doc) => {
            //     array.push(doc.data())
            // })
            // this.leagues = array

            // 2) Or fetch from supabase
            const { data, error } = await supabase.from("leagues").select(`id, api_football_id, name, slug, image`);
            if (error) {
                console.log('error: ', error);
                throw error
            }
            // console.log("data2: ", data);
            const array = []
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            // console.log('array: ', array);
            this.leagues = array

            // 3) Or fetch from local json file
            // const array = []
            // const response = await fetch(`json/leagues.json`);
            // const data = await response.json();
            // for (let i = 0; i < data.length; i++) {
            //     array.push(data[i])
            // }
            // this.leagues = array
        },
    }

    return {
        subscribe,
        ...methods,
    }
}

export const leagueStore = createLeagueStore()
