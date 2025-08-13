import { writable } from 'svelte/store'
import { supabase } from "@lib/supabase/supabaseClient";

const state = {
    league: null,
    leagues: [],
    leaguesByCountryId: [],
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
            // this.leagues = array
            update((state) => ({ ...state, leagues: [...array] }))

            // 3) Or fetch from local json file
            // const array = []
            // const response = await fetch(`json/leagues.json`);
            // const data = await response.json();
            // for (let i = 0; i < data.length; i++) {
            //     array.push(data[i])
            // }
            // this.leagues = array
        },

        async fetchLeaguesByCountryId (countryId) {
            console.log('[Store] fetchLeaguesByCountry()');
            const { data, error } = await supabase
                .from("leagues")
                .select(`id, api_football_id, name, slug, image`)
                .eq('country_id', countryId);
            if (error) {
                console.log('error: ', error);
                throw error
            }
            const array = []
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            update((state) => ({ ...state, leaguesByCountryId: [...array] }))
        },
        
        setLeague: (league) => {
            console.log('[Store] setLeague()')
            update((state) => ({ ...state, league: league }))
        }
    }

    return {
        subscribe,
        ...methods,
    }
}

export const leagueStore = createLeagueStore()
