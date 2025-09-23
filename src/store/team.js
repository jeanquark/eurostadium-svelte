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
        },

        async fetchPaginatedTeams(page = 1, pageSize = 10, sortBy = 'id', sortOrder = 'asc') {
            console.log('[Store] fetchPaginatedTeams()', page, pageSize, sortBy, sortOrder)
            // const { data, error } = await supabase.from("countries").select(`id, name, image`);
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1

            const { data, error, count } = await supabase
                .from('teams')
                .select('*, stadium:stadiums (id, name), league:leagues(id, name)', { count: 'exact' })
                // .order('id', { ascending: true })
                .order(sortBy, { ascending: sortOrder === 'asc' })
                .range(from, to)
            console.log("[Store] fetchPaginatedTeams() data: ", data);
            if (error) {
                console.log('error: ', error);
            }

            update((state) => ({
                ...state, paginatedTeams: {
                    data,
                    totalCount: count,
                    currentPage: page,
                    totalPages: Math.ceil(count / pageSize)
                }
            }))
        },
    }

    return {
        subscribe,
        ...methods,
    }
}

export const teamStore = createTeamStore()
