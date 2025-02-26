# Contributing

To get started, install [Bun](https://bun.sh) and install dependencies:

```sh
bun i
```

Next, you're gonna need an API key for gemini. Get it here: https://aistudio.google.com

Then copy `backend/.env.template` to `backend/.env`, filling out the token.

After you've added the secret, you should be able to run the test docs website:

```sh
bun dev
```

Click the "Ask AI" button in the bottom right corner, and you should be able to chat with the AI!

## Project Structure

Two main folders and a few subdirecties of note:

- `plugin/` - Contains the Vitepress plugin code for generating knowledge files and adding "Ask AI" button to the page.
- `backend/` - Contains the standalone server that must be hosted alongside your docs site. Includes the actual chat window UI.
   - `server/` - Server side code using [`elysia`](https://elysiajs.com)
   - `app/` - Frontend code for chat UI
   - `shared/` - Any shared utils or types used by both the `server/` and `app/` directories.

### Responsibilities

The plugin is responsible for adding the "Ask AI" script to the page. It is also responsible for showing the modal overlay the chat window goes inside of.

The backend is responsible for hosting the chat UI code and any APIs it requires. The UI is added to the modal as an iframe. There are several benefits to this approach:

- The chat window styles don't effect the documentation's styles.
- The JS for the button and overlay is tiny, and loads instantly
- The chat can be accessed from both the vitepress site (as modal) and the website (as a full size website), both sharing conversation history.
- Easier to build

Downsides to this approach are:

- The chat is less integrated into VitePress, not inheriting styles and appearance
- Cannot use brand color from docs site automatically.

But the benefits outweigh the downsides, so that's why it's designed the way it is.
