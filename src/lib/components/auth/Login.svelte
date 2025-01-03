<script>
    import { jwtDecode } from "jwt-decode";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { addToast } from "@store/toast";

    let loading = $state(false);
    let email = $state("");
    let password = $state("");
    let passwordError = $state("");
    let passwordShow = $state(false);

    onMount(() => {});

    const handleLogin = async () => {
        try {
            console.log("handleLogin");
            loading = true;
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            // console.log('error: ', error);
            if (error) throw error;
            console.log("data: ", data);
            // console.log("Login completed!");
            addToast({
                message: "Login success.",
                type: "success",
                dismissible: true,
                timeout: 3000,
            });
            goto("/");
        } catch (error) {
            console.log("error: ", error);
            // console.log("error.response: ", error.response);
            // console.log("error.message: ", error.message);
            // console.log("error.code: ", error.code);
            if (error.code == "invalid_credentials") {
                passwordError = "Wrong credentials";
            } else {
                addToast({
                    message: "An error occured.",
                    type: "error",
                    dismissible: false,
                    timeout: 3000,
                });
            }
        } finally {
            loading = false;
        }
    };
</script>

<div class="" style="">
    <h2 class="text-center my-2">Login</h2>
    <form onsubmit={() => handleLogin()}>
        <div class="row justify-center align-center">
            <div class="col-4 text-right px-2">
                <label for="emailLogin">Email</label>
            </div>
            <div class="col-8 px-2">
                <input
                    id="emailLogin"
                    class="inputField"
                    type="email"
                    placeholder="Your email"
                    required
                    bind:value={email}
                />
            </div>
        </div>
        <div class="row justify-center align-center my-1">
            <div class="col-4 text-right px-2">
                <label for="passwordInput">Password</label>
            </div>
            <div class="col-8 px-2 border-0">
                <!-- passwordShow: {passwordShow}<br /> -->
                <div class="input-group">
                    <input
                        id="passwordInput"
                        class="inputField"
                        type={passwordShow ? "text" : "password"}
                        placeholder="Your password"
                        required
                        bind:value={password}
                        oninput={() => (passwordError = "")}
                    />
                    <button
                        type="button"
                        class="btn"
                        onclick={(e) => {
                            e.stopPropagation();
                            passwordShow = !passwordShow;
                        }}
                        ><img
                            src={`/images/icons/${passwordShow ? "eye-solid.svg" : "eye-slash-solid.svg"}`}
                            alt="eye-solid"
                        /></button
                    >
                </div>
                {#if passwordError}
                    <small class="help">{passwordError}</small>
                {/if}
            </div>
        </div>
        <div class="row justify-center">
            <div class="col-12 text-center border-0">
                <button
                    type="submit"
                    class=""
                    style="width: auto;"
                    disabled={loading}
                >
                    <span>{loading ? "Loading" : "Login"}</span>
                </button>
            </div>
        </div>
    </form>
</div>

<style>
    input[type="text"],
    input[type="email"],
    input[type="password"] {
        width: 100%;
        padding: 12px 10px;
        margin: 0px 0px;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    .input-group {
        display: flex;
        align-items: center;
    }
    .btn {
        width: 20px;
        margin-left: -25px;
        cursor: pointer;
        border: none;
        padding: 0;
        background: transparent;
    }
    .btn img {
        width: 100%;
        vertical-align: middle;
    }

    button[type="submit"] {
        width: 100%;
        background-color: #4caf50;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button[type="submit"]:hover {
        background-color: #45a049;
    }
    .help {
        margin: 0px 10px;
        color: IndianRed;
    }
</style>
