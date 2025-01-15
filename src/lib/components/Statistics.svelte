<script>
    import { onMount } from "svelte";
    import { leagueStore } from "@store/league";
    import { supabase } from "@lib/supabase/supabaseClient";

    onMount(async () => {
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

        const country = document.getElementById("country");
        animate(country, 0, 50, 2000);
        const league = document.getElementById("league");
        animate(league, 0, 39, 2000);
        const team = document.getElementById("team");
        animate(team, 0, 697, 2000);
        const stadium = document.getElementById("stadium");
        animate(stadium, 0, 667, 2000);
    });

    const animate = (obj, start, end, duration) => {
        // console.log("animate");
        // const obj = document.getElementById("value");
        // console.log("obj: ", obj);
        let startTimestamp = null;

        const inOutQuad = (n) => {
            n *= 2;
            if (n < 1) return 0.5 * n * n;
            return -0.5 * (--n * (n - 2) - 1);
        };
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
                (timestamp - startTimestamp) / duration,
                1,
            );
            const progress2 = inOutQuad(progress);
            obj.innerHTML = Math.floor(progress2 * (end - start) + start);
            if (progress2 < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
</script>

<div class="row my-5" style="justify-content: space-between;">
    <!-- <div class="col-12">
        <button
            type="button"
            onclick={() =>
                animate(document.getElementById("value"), 0, 100, 3000)}
            >Animate</button
        >
        <div id="value" style="font: 800 40px system-ui;">0</div>
    </div> -->
    <div class="col-sm-6 col-md-3 text-center pr-2" style="">
        <div class="box">
            <p>
                <img
                    src="/images/icons/country.svg"
                    height="30"
                    alt="Country"
                />
            </p>
            <h2 class="my-2" id="country">50</h2>
            <p style="font-size: 1.3em;">countries</p>
        </div>
    </div>
    <div class="col-sm-6 col-md-3 text-center px-2">
        <div class="box">
            <p>
                <img src="/images/icons/league.svg" height="30" alt="League" />
            </p>
            <h2 class="my-2" id="league">{$leagueStore.leagues?.length}</h2>
            <p style="font-size: 1.3em;">leagues</p>
        </div>
    </div>
    <div class="col-sm-6 col-md-3 text-center px-2">
        <div class="box">
            <p><img src="/images/icons/team.svg" height="30" alt="Team" /></p>
            <h2 class="my-2" id="team">697</h2>
            <p style="font-size: 1.3em;">teams</p>
        </div>
    </div>
    <div class="col-sm-6 col-md-3 text-center pl-2">
        <div class="box">
            <p>
                <img
                    src="/images/icons/stadium.svg"
                    height="30"
                    alt="Stadium"
                />
            </p>
            <h2 class="my-2" id="stadium">690</h2>
            <p style="font-size: 1.3em;">stadiums</p>
        </div>
    </div>
</div>

<style>
    .box {
        background-color: rgba(193, 216, 210, 0.5);
        padding: 1em;
        border: 2px solid #000;
        border-radius: 0.5em;
    }
</style>
