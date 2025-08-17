<script>
    import { onMount } from 'svelte'
    import { jwtDecode } from 'jwt-decode'
    import { goto } from '$app/navigation'
    import { base } from '$app/paths'
    import { supabase } from '@lib/supabase/supabaseClient'
    import '../../app.css'
    import Toasts from '@components/Toasts.svelte'
    import { addToast } from '@store/toast'
    import { page } from '$app/stores'
    // import Sidebar from '@components/Sidebar.svelte'
    // import '@lib/fontawesome.js';
    import { fade } from 'svelte/transition'
    // import '@fortawesome/fontawesome-free/css/all.css'
    import '../../styles/sidebar.css'
    // import '@lib/../styles/sidebar.css'
    // import '@src/styles/sidebar.css'
    // import '@styles/sidebar.css'
    import '../../styles/table.css'

    let { children } = $props()

    onMount(() => {
        supabase.auth.onAuthStateChange((_event, _session) => {
            console.log('[onAuthStateChange] session: ', _session)
            if (!_session) {
                addToast({
                    message: 'You are not authenticated.',
                    type: 'error',
                    dismissible: false,
                    timeout: 3000,
                })
                goto('/auth/login')
                return
            }
            const jwt = jwtDecode(_session?.access_token)
            // console.log("jwt: ", jwt);
            const userRoles = jwt.user_roles
            if (!userRoles) {
                addToast({
                    message: 'No role found in JWT.',
                    type: 'error',
                    dismissible: false,
                    timeout: 3000,
                })
            }
            // console.log("userRoles: ", userRoles);
            if (!userRoles.find((role) => role == 'admin')) {
                addToast({
                    message: 'You are not authenticated as an admin.',
                    type: 'warning',
                    dismissible: false,
                    timeout: 3000,
                })
                goto('/')
            }
        })
    })

    let collapsed = $state(false)
    const isActive = (href) => $page.url.pathname === href

    // Optional: Add localStorage persistence
    if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem('sidebarCollapsed')
        if (savedState) collapsed = savedState === 'true'
    }

    const toggleSidebar = () => {
        collapsed = !collapsed
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', collapsed)
        }
    }
    const handleLogout = () => {
        try {
            const { error } = supabase.auth.signOut()
            if (error) {
                console.log('error: ', error)
                throw error
            }
            addToast({
                message: 'Logout success.',
                type: 'success',
                dismissible: false,
                timeout: 3000,
            })
            goto('/')
        } catch (error) {
            console.log('error: ', error)
            addToast({
                message: 'An error occured.',
                type: 'error',
                dismissible: false,
                timeout: 3000,
            })
        }
    }
</script>

<svelte:head>
    <title>Eurostadium - Admin</title>
    <meta name="robots" content="noindex" />
    <link href="https://fonts.googleapis.com/css?family=Gelasio" rel="stylesheet" />
</svelte:head>

<div class="app">
    <!-- <Sidebar>
        <h1>Main Content Area</h1>
        <p>Click the menu button to toggle the sidebar.</p>
    </Sidebar> -->
    <aside class="sidebar {collapsed ? 'collapsed' : ''}">
        <div class="sidebar-header">
            <!-- <h2 class="sidebar-title" in:fade>Menu</h2> -->
            <button class="toggle-btn" onclick={toggleSidebar}>
                {#if collapsed}
                    <!-- <FontAwesomeIcon icon="bars" /> -->
                    <!-- <Fa icon={faUser} /> -->
                    <!-- <i class="fas fa-bars"></i> -->
                    <img src="/images/icons/bars.svg" height="30" alt="Menu" />
                    <!-- expand -->
                {:else}
                    <!-- <FontAwesomeIcon icon="times" /> -->
                    <!-- <Fa icon={faUser} /> -->
                    <!-- <i class="fas fa-times"></i> -->
                    <img src="/images/icons/times.svg" height="30" alt="Close" />
                    <!-- collapse -->
                {/if}
            </button>
        </div>

        <ul class="sidebar-menu">
            <li class:active={isActive('/admin')}>
                <a href="/admin">
                    <!-- <i class="fas fa-home"></i> -->
                    <img src="/images/icons/gauge.svg" height="30" alt="Gauge" class="mr-2" />
                    <span class="menu-text" in:fade out:fade>Admin</span>
                </a>
            </li>
            <li class:active={isActive('/admin/stadiums')}>
                <a href="/admin/stadiums">
                    <!-- <i class="fas fa-futbol"></i> -->
                    <img src="/images/icons/futbol.svg" height="30" alt="Futbol" class="mr-2" />
                    <span class="menu-text" in:fade out:fade>Stadiums</span>
                </a>
            </li>
            <li class:active={isActive('/admin/users')}>
                <a href="/admin/users">
                    <!-- <i class="fas fa-users"></i> -->
                    <img src="/images/icons/users.svg" height="30" alt="Users" class="mr-2" />
                    <span class="menu-text" in:fade out:fade>Users</span>
                </a>
            </li>
            <li>
                <a href="/">
                    <!-- <i class="fas fa-home"></i> -->
                    <img src="/images/icons/home.svg" height="30" alt="Home" class="mr-2" />
                    <span class="menu-text" in:fade out:fade>Home</span>
                </a>
            </li>
            <li>
                <a href="/" onclick={handleLogout}>
                    <img src="/images/icons/right-from-bracket.svg" height="30" alt="Logout" class="mr-2" />
                    <span class="menu-text" in:fade out:fade>Logout</span>
                </a>
            </li>
        </ul>
    </aside>

    <main class="main-content border-0">
        <div style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
            <Toasts />
        </div>
        <!-- collapsed: {collapsed}<br /> -->
        <!-- <div class="row">
            <div class="col-2" style="background: #ccc; border: 2px solid orange;">
                <ul>
                    <li class:active={$page.url.pathname == '/admin'}>
                        <a href="/admin">Admin</a>
                    </li>
                    <li class:active={$page.url.pathname == '/admin/stadiums'}>
                        <a href="/admin/stadiums">Stadiums</a>
                    </li>
                    <li class:active={$page.url.pathname == '/admin/users'}>
                        <a href="/admin/users">Users</a>
                    </li>
                    <li><a href="{base}/">&larr;Home</a></li>
                    <li>
                        <button onclick={() => handleLogout()}>Logout</button>
                    </li>
                </ul>
            </div> -->
        <!-- <div class="col-10" style="border: 2px solid orangered;"> -->
        <!-- $page.url.pathname: {$page.url.pathname}<br /> -->
        {@render children()}
        <!-- </div> -->
        <!-- </div> -->
    </main>
</div>

<style scoped>
    :global(:root) {
        --sidebar-width: 250px;
        --sidebar-collapsed-width: 80px;
        --transition-time: 0.3s;
    }
    .app {
        display: flex;
        min-height: 100vh;
    }

    .active {
        background-color: #34495e;
    }
</style>
