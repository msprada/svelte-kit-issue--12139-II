<script lang="ts">
	const url: string = '/signin/auth0/';
	const encodedUrl: string = encodeURI(url);
</script>

<h1>Sign in</h1>
<a href={encodedUrl}>Sign in with Auth0</a>