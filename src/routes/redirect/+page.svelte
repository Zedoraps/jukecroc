<script>
    import {loadVideosBySort, pb} from "$lib/pocketbase";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    let redirectUrl = 'https://croc.moes.li/redirect';
    let result;
    let error;
    let username;

    onMount(() => {
        redirectUrl = window.location.protocol + "//" + window.location.host + "/redirect"
        // parse the query parameters from the redirected url
        const params = (new URL(window.location)).searchParams;

        // load the previously stored provider's data
        const provider = JSON.parse(localStorage.getItem('provider'))

        // compare the redirect's state param and the stored provider's one
        if (provider.state !== params.get('state')) {
            throw "State parameters don't match.";
        }

        // authenticate
        pb.collection('users').authWithOAuth2(
            provider.name,
            params.get('code'),
            provider.codeVerifier,
            redirectUrl,
            {
                emailVisibility: false,
            }).then((authData) => {
            result = authData
            username = authData?.record?.username;
            if (username) {
                loadVideosBySort("-created", false);
                if (username.startsWith("users")) {
                    goto("/user")
                } else {
                    goto(`/`)
                }
            }
        }).catch((err) => {
            error = "Failed to exchange code.\n" + err;
        });
    })

</script>

{#if error}
    {error}
{:else}
    <h3>👀Grad no chli am lade</h3>
{/if}
