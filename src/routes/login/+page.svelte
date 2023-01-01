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
<div class="responsive">
    {#if $currentUser}
        <p>👨‍💻 Iglogt als {$currentUser.username}</p>
    {:else if authMethods.length < 1}
        <div style="margin: 0 auto; display: block; width: 100px; margin-top: 200px;">
            <a class="loader large"></a>
        </div>
    {:else}
        {#each authMethods as prov (authMethods.id)}
                <a href="{prov.authUrl + redirectUri}"
                   on:click={() => {localStorage.setItem('provider', JSON.stringify(prov))}} class="responsive large-margin">
                    <button class="large medium-elevate responsive">
                        <img class="responsive"
                             src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                        <span>Ilogge met Google</span>
                    </button>
                </a>
        {/each}
    {/if}
</div>
