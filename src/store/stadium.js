import { writable } from 'svelte/store'
import { supabase } from '@lib/supabase/supabaseClient'

const state = {
    loading: false,
    stadiums: [],
    stadiumsByCountry: {},
    stadiumsByLeagueId: {},
    stadiumsByCountry2: {
        switzerland: [
            {
                name: 'St. Jakob-Park',
                city: 'Basel',
                images: [],
            },
            {
                name: 'Stadion Wankdorf',
                city: 'Bern',
                images: [],
            },
        ],
        germany: [
            {
                name: 'Fußball Arena München',
                city: 'München',
                images: [],
            },
            {
                name: 'Düsseldorf Arena',
                city: 'Düsseldorf',
                images: [],
            },
        ],
    },
}

function createStadiumStore() {
    const { subscribe, set, update } = writable(state)

    const methods = {
        toggleLoading: () => {
            // console.log('[stadiumStore] toggleLoading')
            update((state) => ({ ...state, loading: !state.loading }))
        },
        async fetchStadiums() {
            console.log('[Store] fetchStadiums()')
            const { data, error } = await supabase.from("stadiums").select(`*`);
            const array = []
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
            console.log('array: ', array);
            update((state) => ({ ...state, stadiums: [...array] }))
        },
        async fetchStadiumsByCountrySlug(countrySlug) {
            console.log('[Store] fetchStadiumsByCountrySlug: ', countrySlug);
            const { data, error } = await supabase.from('teams_view').select(`stadium_id, stadium_api_football_id, stadium_name, stadium_city, stadium_capacity, stadium_wiki, stadium_x, stadium_y, league_id, league_api_football_id, league_name, team_id, team_api_football_id, team_name, team_wiki, image_name, image_url, image_src`).eq('country_slug', countrySlug)
            // console.log('[stadiumStore] data: ', data)
            if (error) {
                console.log('error: ', error)
                return
            }
            function groupBy(list, keyGetter) {
                const map = new Map()
                list.forEach((item) => {
                    const key = keyGetter(item)
                    const collection = map.get(key)
                    if (!collection) {
                        // map.set(key, [item])
                        map.set(key, {
                            stadium: {
                                id: item.stadium_id,
                                api_football_id: item.stadium_api_football_id,
                                name: item.stadium_name,
                                city: item.stadium_city,
                                capacity: item.stadium_capacity,
                                wiki: item.stadium_wiki,
                                x: item.stadium_x,
                                y: item.stadium_y
                            },
                            leagues: [{
                                id: item.league_id,
                                api_football_id: item.league_api_football_id,
                                name: item.league_name
                            }],
                            teams: [{
                                id: item.team_id,
                                api_football_id: item.team_api_football_id,
                                name: item.team_name,
                                wiki: item.team_wiki
                            }],
                            images: [{
                                name: item.image_name,
                                url: item.image_url,
                                src: item.image_src
                            }]
                        })
                    } else {
                        // collection.push(item)
                        if (!collection.leagues.find((league) => league.name == item.league_name)) {
                            collection.leagues.push({
                                id: item.league_id,
                                api_football_id: item.league_api_football_id,
                                name: item.league_name
                            })
                        }
                        if (!collection.teams.find((team) => team.name == item.team_name)) {
                            collection.teams.push({
                                id: item.team_id,
                                api_football_id: item.team_api_football_id,
                                name: item.team_name,
                                wiki: item.team_wiki
                            })
                        }
                        if (!collection.images.find((image) => image.name == item.image_name)) {
                            collection.images.push({
                                name: item.image_name,
                                url: item.image_url,
                                src: item.image_src
                            })
                        }
                    }
                })
                return map
            }
            const stadiumsMap = groupBy(data, (el) => el.stadium_id)
            // console.log('countrySlug: ', countrySlug)
            // console.log('state.stadiumsByCountry 1: ', state.stadiumsByCountry)

            let array = []
            // for (let i = 0; i < abc.length; i++) {
            for (let [key, value] of stadiumsMap) {
                // console.log('value: ', value);
                // value.images = value.images.sort((a, b) => a.name - b.name)
                value.images.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });
                array.push(value)
            }
            console.log('array: ', array);
            update((state) => {
                let entry = { ...state }
                entry.stadiumsByCountry[countrySlug] = array
                // x.stadiumsByCountry[countrySlug] = [
                //     {
                //         name: 'St. Jakob-Park',
                //         city: 'Basel',
                //         images: [],
                //     },
                //     {
                //         name: 'Stadion Wankdorf',
                //         city: 'Bern',
                //         images: [],
                //     },
                // ]
                return entry
            })

            // console.log('state.stadiumsByCountry 2: ', state.stadiumsByCountry)
        },
        async fetchStadiumsByLeagueId(leagueId) {
            console.log('[StadiumStore] fetchStadiumsByLeagueId: ', leagueId)

            // const { data, error } = await supabase.from('teams_view').select(`stadium_id, stadium_api_football_id, stadium_name, stadium_city, stadium_capacity, stadium_wiki, stadium_x, stadium_y, league_id, league_api_football_id, league_name, team_id, team_api_football_id, team_name, team_wiki, image_name, image_url, image_src`).eq('league_id', leagueId)
            const { data, error } = await supabase.from('teams_view').select(`id:stadium_id, api_football_id:stadium_api_football_id, name:stadium_name, city:stadium_city, capacity:stadium_capacity, league_id, league_api_football_id, league_name, team_id, team_api_football_id, team_name, image_name, image_url, stadium_x, stadium_y`).eq('league_id', leagueId)
            // console.log('[StadiumStore] data: ', data)
            console.log('data: ', data);

            // 1. Group by stadium_name and collect images
            const groupedByStadium = data.reduce((acc, current) => {
                const existing = acc.find(stadium => stadium.id === current.id);

                if (existing) {
                    if (!existing.images.some(image => image.name === current.image_name)) {
                        existing.images.push({
                            name: current.image_name,
                            url: current.image_url
                        });
                    }
                } else {
                    acc.push({
                        id: current.id,
                        name: current.name,
                        city: current.city,
                        capacity: current.capacity,
                        league_id: current.league_id,
                        league_api_football_id: current.league_api_football_id,
                        league_name: current.league_name,
                        team_id: current.team_id,
                        team_api_football_id: current.team_api_football_id,
                        team_name: current.team_name,
                        x: current.stadium_x,
                        y: current.stadium_y,
                        images: current.image_name ? [{
                            name: current.image_name,
                            url: current.image_url
                        }] : []
                    });
                }

                return acc;
            }, []);

            console.log('groupedByStadium: ', groupedByStadium);

            // 2. Sort by capacity in descending order
            const sortedStadiums = groupedByStadium.sort((a, b) =>
                b.capacity - a.capacity
            );


            if (error) {
                console.log('error: ', error)
                return
            }

            update((state) => {
                let entry = { ...state }
                entry.stadiumsByLeagueId[leagueId] = sortedStadiums
                return entry
            })
        },

        async fetchPaginatedStadiums(page = 1, pageSize = 20, sortBy = 'id', sortOrder = 'asc') {
            console.log('[Store] fetchPaginatedStadiums()', page, pageSize, sortBy, sortOrder)
            // const { data, error } = await supabase.from("countries").select(`id, name, image`);
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1

            const { data, error, count } = await supabase
                .from('stadiums')
                .select('*, teams (id, name), images (*), country: teams (leagues(countries(id, name, image)))', { count: 'exact' })
                .order(sortBy, { ascending: sortOrder === 'asc' })
                .range(from, to)
            // const { data, error, count } = await supabase
            //     .from('teams_view')
            //     .select('*', { count: 'exact' })
            //     .eq('country_name', 'Switzerland')
            //     // .group('team_id')
            //     // .order(sortBy, { ascending: sortOrder === 'asc' })
            //     .range(from, to)
            console.log("data2: ", data);
            if (error) {
                console.log('error: ', error);
            }

            update((state) => ({
                ...state, paginatedStadiums: {
                    data,
                    totalCount: count,
                    currentPage: page,
                    totalPages: Math.ceil(count / pageSize)
                }
            }))
        },

        // async fetchStadiumsByCountry2(country) {
        //     console.log('[StadiumStore] fetchStadiumsByCountry() country: ', country)
        //     const { data, error } = await supabase.from('stadiums').select(`id, name, capacity, x, y, images (id, name, api_football_venue_id, user_id)`).eq('country_id', 1)
        //     console.log('data2: ', data)
        //     console.log('error: ', error)
        //     const array = []
        //     for (let i = 0; i < data.length; i++) {
        //         array.push(data[i])
        //     }
        //     console.log('array: ', array)
        //     // this.stadiums = array
        // },
        // async fetchStadiumsByCountry3(country) {
        //     console.log('[StadiumStore] fetchStadiumsByCountry country: ', country)

        //     // // 1) Fetch from Firestore
        //     // const stadiumsRef = collection(db, `countries/${country}/stadiums`)
        //     // const q = query(stadiumsRef, orderBy('venue.capacity', 'asc'))
        //     // const querySnapshot = await getDocs(q)

        //     // console.log('[Firebase call] StadiumStore querySnapshot: ', querySnapshot)
        //     // const array = []
        //     // querySnapshot.forEach((doc) => {
        //     //     array.push(doc.data())
        //     // })

        //     // 2) Or fetch from local json file
        //     const array = []
        //     const response = await fetch(`json/teams/${country}.json`)
        //     const data = await response.json()
        //     for (let i = 0; i < data.length; i++) {
        //         array.push(data[i])
        //     }
        //     console.log('data: ', data)
        //     console.log('array: ', array)

        //     this.setStadiums({ [country]: array })
        // },
        setStadiums(entry) {
            const key = Object.keys(entry)[0]
            const value = Object.values(entry)[0]
            console.log('key: ', key)
            console.log('value: ', value)
            update((state) => {
                let x = { ...state }
                x.stadiums[key] = value
                return x
            })
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
