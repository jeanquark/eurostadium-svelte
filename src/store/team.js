import { writable } from "svelte/store";
import { supabase } from "@lib/supabase/supabaseClient";

const state = {
    teams: [],
}

function createTeamStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        async fetchTeams() {
            console.log('[Store] fetchTeams()')
            const { data, error } = await supabase.from("teams").select(`*`);
            console.log("data2: ", data);
            const array = []
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            console.log('array: ', array);
            // this.countries = array
            update((state) => ({ ...state, teams: [...array] }))
        }
    }

    return {
        subscribe,
        ...methods,
    }
}

export const teamStore = createTeamStore()
