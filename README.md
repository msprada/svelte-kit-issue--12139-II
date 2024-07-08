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



# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
