<script>
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import { goto } from "$app/navigation";
    import { supabase } from "@lib/supabase/supabaseClient";
    import Login from "@components/auth/Login.svelte";
    import { addToast } from "@store/toast";
    // import { getNotificationsContext } from "svelte-notifications";

    let session = $state(null);
    let loading = $state(false);
    let email = $state("");
    let password = $state("");
    // const { addNotification } = getNotificationsContext();

    onMount(() => {
        supabase.auth.getSession().then(({ data }) => {
            session = data.session;
        });

        supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session;
            console.log("[onAuthStateChange] session: ", session);
            // console.log("session: ", session);
            if (session) {
                // addToast({
                //     message: "You are authenticated.",
                //     type: "info",
                //     dismissible: false,
                //     timeout: 3000,
                // });
                goto("/");
            }
        });
    });

    const handleLogin = async () => {
        try {
            loading = true;
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            console.log("data: ", data);
            console.log("Login completed!");
            // addNotification({
            //     text: "Notification",
            //     position: "bottom-center",
            // });
            goto("/");

            // const { subscription } = supabase.auth.onAuthStateChange(
            //     async (event, session) => {
            //         if (session) {
            //             console.log("session: ", session);
            //         }
            //     },
            // );
        } catch (error) {
            console.log("error: ", error);
            // alert(error)
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            loading = false;
        }
    };
</script>

<div class="">
    <a href="{base}/">Home page</a>&nbsp;|&nbsp;
    <a href="{base}/auth/register">Register</a>&nbsp;|&nbsp;
    <a href="{base}/auth/account">Account</a><br />
    <!-- <Login {supabase} {session} /> -->

    <div class="row">
        <!-- <div class="col-6 border-1">col-6</div>
        <div class="col-6 border-2">col-6</div> -->
    </div>

    <div class="row justify-center">
        <div class="col-4 border-1" style="background: #f2f2f2;">
            <Login />
            <!-- <form class="" onsubmit={handleLogin}>
                <div>
                    <label for="emailLogin">Email</label>
                    <input
                        id="emailLogin"
                        class="inputField"
                        type="email"
                        placeholder="Your email"
                        bind:value={email}
                    />
                </div>
                <div>
                    <label for="passwordLogin">Password</label>
                    <input
                        id="passwordLogin"
                        class="inputField"
                        type="password"
                        placeholder="Your password"
                        bind:value={password}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        class="button block"
                        aria-live="polite"
                        disabled={loading}
                    >
                        <span>{loading ? "Loading" : "Login"}</span>
                    </button>
                </div>
            </form> -->
        </div>
    </div>
</div>

<style>
</style>
