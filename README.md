# Addabaz

Addabaz (from আড্ডাবাজ, someone who loves a good adda) is a small social network built with React. It started as a course project called FaceHook. People can sign up, write posts with or without a photo, like and comment on posts, and edit their profile picture and bio.

**Live site: [addabaz.vercel.app](https://addabaz.vercel.app)**

This repository is the frontend. The API lives in a separate repository, `backendServer-faceHook`, which is private.

## Features

- Sign up and sign in with email and password. The session is stored in `localStorage`, so a page refresh keeps you signed in.
- Home feed with every post, newest first.
- Post composer for text, an image (up to 4 MB), or both.
- Like and unlike posts, add comments, and delete your own comments.
- Delete your own posts. The post author can also remove any comment on their post.
- Profile page with a cover banner, profile picture upload, an editable bio, and counts of your posts, the likes you have given, the comments you have written and the likes your posts have received.
- Users without a profile picture get an avatar with their initials on a colour picked from their name.
- Layout works from phone width up to wide desktop screens.

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React 18, Vite 5, React Router 6 |
| Forms | React Hook Form |
| Styling | Tailwind CSS 3 |
| HTTP | Axios, with interceptors that attach the access token and refresh it on a 401 |
| API | Express 4 running as a Vercel serverless function |
| Database | MongoDB Atlas, through Mongoose |
| Image storage | Vercel Blob |
| Hosting | Vercel (two projects: `facehook` serves this app at addabaz.vercel.app, `facehook-api` serves the API) |

## How it fits together

```
Browser ──> addabaz.vercel.app        (this repo, static React build)
   │
   └──── API calls ──> facehook-api.vercel.app   (Express on Vercel)
                          ├── MongoDB Atlas   users, posts, comments, likes
                          └── Vercel Blob     uploaded avatars and post images
```

The API only accepts browser requests from the frontend's domains (CORS). Every route except sign-up, sign-in, token refresh and the health check needs a valid access token.

## Project structure

```
src/
  api/            Axios instance and the API base URL
  components/
    auth/         Sign-in and sign-up forms, shared auth layout and inputs
    common/       Header, logo, avatar, icon set
    posts/        Post composer, post card, post list with loading skeletons
    profile/      Profile header, picture upload, bio editor, your posts
  context/        React contexts for auth and profile
  hooks/          useAuth, useAxios, useProfile, useCurrentUser
  pages/          Home, profile, sign-in, sign-up, 404
  providers/      Auth (persisted to localStorage) and profile providers
  reducers/       Profile reducer
  routes/         PrivateRoutes: redirects to /login when signed out
  utils/          Image URL helper, relative time formatting
```

## Running it locally

Prerequisites: Node.js 18 or newer, and the API running locally or a deployed copy of it.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Point the app at the API. `.env.development` already uses a local API:

   ```bash
   VITE_SERVER_BASE_URL=http://localhost:3000
   ```

   Change it if your API runs somewhere else.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app opens at `http://localhost:5173`.

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## Environment variables

| Name | Where | Value |
|---|---|---|
| `VITE_SERVER_BASE_URL` | `.env.development` locally, Vercel project settings in production | The API's base URL, without a trailing slash |

Vite bakes this value into the build, so after changing it on Vercel you need to redeploy.

## Deployment

The `facehook` project on Vercel is connected to this repository. Every push to `main` builds and deploys the site automatically. `vercel.json` rewrites all paths to `index.html`, so routes such as `/me` load correctly on refresh.

The API deploys the same way from its own repository. Its Vercel project has MongoDB Atlas and a public Blob store connected through the Vercel Storage tab, and `CLIENT_URL` set to this site's URL.

## API endpoints used by the app

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Create an account and get tokens |
| POST | `/auth/login` | Sign in and get tokens |
| POST | `/auth/refresh-token` | Get a new access token |
| GET | `/posts` | All posts |
| POST | `/posts` | Create a post (multipart: `content`, optional `image`) |
| DELETE | `/posts/:postId` | Delete your post |
| PATCH | `/posts/:postId/like` | Like or unlike |
| PATCH | `/posts/:postId/comment` | Add a comment |
| DELETE | `/posts/:postId/comment/:commentId` | Delete a comment |
| GET | `/profile/:userId` | A user, their posts and activity counts |
| PATCH | `/profile/:userId` | Update your name or bio |
| POST | `/profile/:userId/avatar` | Upload your profile picture (multipart: `avatar`) |
