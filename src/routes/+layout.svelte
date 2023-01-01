<script>
    import {currentUser, pb} from "$lib/pocketbase.ts";
    import LikeFeed from "$lib/LikeFeed.svelte";
    import VideoFeed from "$lib/VideoFeed.svelte";
    import {onDestroy, onMount} from "svelte";

    export const ssr = false;
    export const prerender = true;

    function signOut() {
        pb.authStore.clear()
    }

    let unsub;
    onMount(async () => {
        unsub = await pb
            .collection('users')
            .subscribe("*", async ({action, record}) => {
                if ($currentUser.id == record.id) {
                    if (action === 'update') {
                        console.log("current user")
                        currentUser.set(record)
                    }
                }
            });
    });

    onDestroy(() => {
        unsub?.();
    });

</script>

<style>
    main {
        background-color: white;
        padding: 1rem;
        border-radius: 2px;
    }

    nav {
        background-color: white;
        border-radius: 2px;
        padding: 1rem;
        display: flex;
        align-items: stretch;
        justify-content: space-evenly;
    }

    nav a {
        display: inline-block;
        outline: 0;
        border: 0;
        cursor: pointer;
        font-size: 30px;
        text-decoration: none;
        line-height: 1;
        position: relative;
        padding: 10px;
        background: var(--secondary);
        background-image: linear-gradient(122deg, rgba(55, 128, 224, 0.63), rgba(26, 108, 190, 0.27));
        background-size: 300px, 300px, 100%;
        color: #fff;
        border-bottom: 5px solid var(--accent);
        box-shadow: 0 0 3px 3px rgb(0 0 0 / 5%);
        text-shadow: 0 0 3px rgb(0 0 0 / 30%);
        transition: all .3s;
    }

    nav a:hover {
        box-shadow: 0 0 3px 3px rgb(0 0 0 / 8%);
    }

</style>


<nav>
    <a href="/">Home</a>
    <a href="/add">Neue Song</a>
    {#if $currentUser?.admin}
        <a href="/admin">Admin</a>
    {/if}
    {#if $currentUser}
        <a href="/user">👤</a>
        <span on:click={signOut}>
        <a href="/login">uslogge</a>
        </span>
    {:else}
        <a href="/login">Ilogge</a>
    {/if}
</nav>
<main>
    <slot></slot>
</main>
<LikeFeed></LikeFeed>
<VideoFeed></VideoFeed>
