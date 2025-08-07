import { writable } from "svelte/store";
import { supabase } from "@lib/supabase/supabaseClient";

const state = {
    users: [],
}

function createUserStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        async fetchUsers() {
            console.log('[Store] fetchUsers()')
            const { data, error } = await supabase.from("users").select(`*`);
            const array = []
            // const { data: data2, error: error2 } = await supabase.from("auth.users").select(`*`);

            const response = await fetch('/api/supabase/fetch-users')
            console.log('[Store] response: ', response);

            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            console.log('[Store] @user array: ', array);
            update((state) => ({ ...state, users: [...array] }))
        }
    }

    return {
        subscribe,
        ...methods,
    }
}

export const userStore = createUserStore()
