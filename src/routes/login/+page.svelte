<script lang="ts">

    import {pb} from "$lib/pocketbase";
    import {currentUser} from "$lib/pocketbase.ts";
    import {onMount} from "svelte";

    let authMethods = []
    let redirectUri = "https://croc.moes.li/redirect"


    onMount(async () => {
        let result = await pb.collection('users').listAuthMethods()
        authMethods = result.authProviders;
        redirectUri = window.location.protocol + "//" + window.location.host + "/redirect"
    });
</script>

{#if $currentUser}
    <p>👨‍💻 Iglogt als {$currentUser.username}</p>
{:else if authMethods.length < 1}
    Grad am lade 🏃‍♂️
{:else}
    <span>Ilogge met:</span>
    {#each authMethods as prov (authMethods.id)}
        <a href="{prov.authUrl + redirectUri}"
           on:click={() => {localStorage.setItem('provider', JSON.stringify(prov))}}>
                    <img class="google-icon"
                         src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                <span class="btn-text"><b>Ilogge met Google</b></span>
        </a>
    {/each}
{/if}


<style>
    a {
        text-decoration: none;
        color: white;
        background-color: #212529;
        display: flex;
        gap: 1rem;
        padding: 1rem;
        border-radius: 2px;
        margin: 0.3rem 1rem;
    }

</style>