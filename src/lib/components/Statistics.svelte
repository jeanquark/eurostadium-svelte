<script>
    import { onMount } from 'svelte'
    import { leagueStore } from '@store/league'
    import { supabase } from '@lib/supabase/supabaseClient'

    onMount(() => {
        // // 1) Countries
        // const { count: countCountries } = await supabase
        //     .from("countries")
        //     .select("id", { count: "exact" });
        // console.log("countCountries: ", countCountries);

        // // 2) Leagues
        // const {
        //     data: data1,
        //     error: error1,
        //     count: count1,
        // } = await supabase
        //     .from("images_by_league_view")
        //     .select("*", { count: "exact" });
        // console.log("data1: ", data1);
        // console.log("count1: ", count1);

        // // 3) Teams
        // const {
        //     data: data2,
        //     error: error2,
        //     count: count2,
        // } = await supabase
        //     .from("images_by_team_view")
        //     .select("*", { count: "exact" });
        // console.log("data2: ", data2);
        // console.log("count2: ", count2);

        // // 4) Images
        // const {
        //     data: data3,
        //     error: error3,
        //     count: count3,
        // } = await supabase
        //     .from("images_by_stadium_view")
        //     .select("*", { count: "exact" });
        // console.log("data3: ", data3);
        // console.log("count3: ", count3);

        const mediaQuery = window.matchMedia('(max-width: 768px)')
        console.log('mediaQuery: ', mediaQuery)
        let country, league, team, stadium

        if (mediaQuery.matches) {
            country = document.getElementById('country-sm')
            league = document.getElementById('league-sm')
            team = document.getElementById('team-sm')
            stadium = document.getElementById('stadium-sm')
        } else {
            country = document.getElementById('country')
            league = document.getElementById('league')
            team = document.getElementById('team')
            stadium = document.getElementById('stadium')
        }

        animate(country, 0, 50, 2000)
        animate(league, 0, 39, 2000)
        animate(team, 0, 697, 2000)
        animate(stadium, 0, 667, 2000)
    })
    const animate = (obj, start, end, duration) => {
        console.log('animate')
        // const obj = document.getElementById("value");
        // console.log("obj: ", obj);
        let startTimestamp = null

        const inOutQuad = (n) => {
            n *= 2
            if (n < 1) return 0.5 * n * n
            return -0.5 * (--n * (n - 2) - 1)
        }
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            const progress2 = inOutQuad(progress)
            obj.innerHTML = Math.floor(progress2 * (end - start) + start)
            if (progress2 < 1) {
                window.requestAnimationFrame(step)
            }
        }
        window.requestAnimationFrame(step)
    }
</script>

<div class="hidden-md-and-up">
    <div
        style="display: flex;
  flex-direction: row; overflow: auto;"
    >
        <div class="col-6 text-center border-0">
            <div class="box mr-1">
                <a href="/countries">
                    <p>
                        <img src="/images/icons/country.svg" height="30" alt="Country" />
                    </p>
                    <h2 class="my-2" id="country-sm">0</h2>
                    <p style="font-size: 1.3em;">countries</p>
                </a>
            </div>
        </div>
        <div class="col-6 text-center border-0">
            <div class="box mx-1">
                <p>
                    <img src="/images/icons/trophy.svg" height="30" alt="League" />
                </p>
                <h2 class="my-2" id="league-sm">0</h2>
                <p style="font-size: 1.3em;">leagues</p>
            </div>
        </div>
        <div class="col-6 text-center border-0">
            <div class="box mx-1">
                <p>
                    <img src="/images/icons/team.svg" height="30" alt="Team" />
                </p>
                <h2 class="my-2" id="team-sm">0</h2>
                <p style="font-size: 1.3em;">teams</p>
            </div>
        </div>
        <div class="col-6 text-center border-0">
            <div class="box ml-1">
                <p>
                    <img src="/images/icons/stadium.svg" height="30" alt="Stadium" />
                </p>
                <h2 class="my-2" id="stadium-sm">0</h2>
                <p style="font-size: 1.3em;">stadiums</p>
            </div>
        </div>
    </div>
</div>

<div class="row hidden-sm-and-down my-5" style="justify-content: space-between;">
    <div class="col-sm-6 col-md-3 text-center" style="">
        <div class="box mr-2">
            <a href="/countries">
                <p>
                    <img src="/images/icons/country.svg" height="30" alt="Country" />
                </p>
                <h2 class="my-2" id="country">50</h2>
                <p style="font-size: 1.3em;">countries</p>
            </a>
        </div>
    </div>
    <div class="col-sm-6 col-md-3 text-center">
        <div class="box mx-2">
            <p>
                <img src="/images/icons/trophy.svg" height="30" alt="League" />
            </p>
            <h2 class="my-2" id="league">{$leagueStore.leagues?.length}</h2>
            <p style="font-size: 1.3em;">leagues</p>
        </div>
    </div>
    <div class="col-sm-6 col-md-3 text-center">
        <div class="box mx-2">
            <p><img src="/images/icons/team.svg" height="30" alt="Team" /></p>
            <h2 class="my-2" id="team">697</h2>
            <p style="font-size: 1.3em;">teams</p>
        </div>
    </div>
    <div class="col-sm-6 col-md-3 text-center">
        <div class="box ml-2">
            <p>
                <img src="/images/icons/stadium.svg" height="30" alt="Stadium" />
            </p>
            <h2 class="my-2" id="stadium">690</h2>
            <p style="font-size: 1.3em;">stadiums</p>
        </div>
    </div>
    <div class="col-sm-6 col-md-3 text-center">
        <div class="counter">
            <div class="counter-icon">🚀</div>
            <div class="modern-counter" style="--value: 1250;"></div>
            <div class="fallback-counter" style="--value-text: '1250';"></div>
            <div class="counter-title">Projects Completed</div>
        </div>
    </div>
</div>

<style>
    .box {
        background-color: rgba(255, 255, 255, 0.6);
        padding: 1em;
        border: 2px solid #ccc;
        border-radius: 0.5em;
    }
    .box h2 {
        color: var(--color-theme-1);
    }
</style>
