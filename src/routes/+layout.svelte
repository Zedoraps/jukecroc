<script>
    import {currentUser, pb} from "$lib/pocketbase.ts";
    import LikeFeed from "$lib/LikeFeed.svelte";
    import VideoFeed from "$lib/VideoFeed.svelte";
    import {onDestroy, onMount} from "svelte";
    import "beercss";
    import {page} from "$app/stores";

    export const ssr = false;
    export const prerender = true;

    let innerWidth = 0
    let innerHeight = 0
    let loaded = false;

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
        loaded = true;
    });

    onDestroy(() => {
        unsub?.();
    });

</script>
<svelte:window bind:innerWidth bind:innerHeight/>
{#if loaded}
    <nav class="left" class:left={innerWidth > 599} class:bottom={innerWidth < 600}>
        <a>
            <img class="circle" src="/favicon.svg">
        </a>
        <a href="/" class:active={$page.route.id ===  "/"}>
            <i>home</i>
            <span>Home</span>
        </a>
        <a href="/add" class:active={$page.route.id === "/add"}>
            <i>add</i>
            <span>Neu</span>
        </a>
        {#if $currentUser}
            {#if $currentUser.admin}
                <a href="/admin" class:active={$page.route.id === "/admin"}>
                    <i>admin_panel_settings</i>
                    <span>Admin</span>
                </a>
            {/if}
            <a href="/user" class:active={$page.route.id === "/user"}>
                <i>account_circle</i>
                <span>Profil</span>
            </a>
            <a href="/login" on:click={signOut}>
                <i>logout</i>
                <span>Uslogge</span>
            </a>
        {:else}
            <a href="/login" class:active={$page.route.id === "/login"}>
                <i>login</i>
                <span>Amälde</span>
            </a>
        {/if}
    </nav>

    <main class="responsive">
        <slot></slot>
    </main>
    <LikeFeed></LikeFeed>
    <VideoFeed></VideoFeed>
{:else }
    <div style="margin: 0 auto; display: block; width: 100px; margin-top: 200px;">
        <a class="loader large"></a>

    </div>
{/if}