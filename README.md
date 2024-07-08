# General
This repo deals with an issue which results in a combination of using pnpm as package manager, vite with specific vite.config.ts (preserveSymlinks:true) and a svelte kit application which uses "redirect" function in a sever component.

The redirect function is implemted as follows, it will throw a Redirect Class

```
export function redirect(status, location) {
	if ((!BROWSER || DEV) && (isNaN(status) || status < 300 || status > 308)) {
		throw new Error('Invalid status code');
	}

	throw new Redirect(
		// @ts-ignore
		status,
		location.toString()
	);
}
```

Within the svelte kit framework a module checks whether the caught error is a Redirect or not.


The svelte kit application uses a default javascript api "instanceof" to check whether an thrown error is a Redirect Class or not. If a redirect is detected the application redirects the user.

If the check fails the user will not be redirected.
The implementation can be found in "@sveltejs/kit/src/runtime/server/page/index.js within method render_page line 208"


```
if (err instanceof Redirect) {
    if (state.prerendering && should_prerender_data) {
        const body = JSON.stringify({
            type: 'redirect',
            location: err.location
        });

        state.prerendering.dependencies.set(data_pathname, {
            response: text(body),
            body
        });
    }

    return redirect_response(err.status, err.location);
}
```


There is a direct influence of this behavour in regard to the **vite.config.ts** setting **preserveSymlinks**. 

If "preserveSymlinks" is set to **true** the instanceof check will fail and the user is not redirected at all.

If "preserveSymlinks" is set to **false** the user is redirected.


# To Reproduce
- install pnpm globally
- install all dependencies by `pnpm install`
- run dev mode 'pnpm run dev'


## Be aware
- currently the instanceof check will fail because preserveSymlinks is set to true, the user is not redirected and a 500 Error Page is shown
- the instanceof check will succeed if the preserveSymlinks is set to false and the user will be redirected correctly




