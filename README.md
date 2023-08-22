# music-bot

An open-source Discord music bot for self-hosting.

## Features

### Implemented

- Play music from YouTube
- Music queue
- Basic music controls
  - Play
  - Pause
  - Resume
  - Skip
  - Stop
  - Jump
  - Playing
  - Shuffle

### Planned

- More music controls
  - Loop
  - Volume
  - Seek
  - Move
- Queuing entire YouTube playlists
- Play music from Spotify
  - Queuing entire Spotify playlists
- Play music from SoundCloud

## Running

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the required values
   1. Navigate to the [Discord Developer Portal - Applications](https://discord.com/developers/applications)
   2. Create/Select an application
   3. In `.env` set `BOT_ID` to Application ID
   4. In `.env` set `BOT_TOKEN` to token found under the Bot page (left sidebar)
   5. **NOTE**: Commands may take up to an hour to register, if this bot is only being used in a single server set
      `IS_DEV` to `true` and set the `DEV_SERVER_ID` to the server ID for instant command registration
3. Run `npm i`
4. Run `npm start`
