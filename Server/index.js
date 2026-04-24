const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const RPC = require('discord-rpc')
require('dotenv').config({ path: require('path').join(__dirname, '.env') })

const app = express()
app.use(bodyParser.json())

// Discord RPC
const clientId = process.env.clientID
RPC.register(clientId)
const rpc = new RPC.Client({ transport: 'ipc' })

// Your OMDb API KEY
const OMDB_KEY = process.env.OMDB_KEY

// ---------- Function to get series name ----------
async function getTitleFromIMDB(id) {
    try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${id}`)
        const data = await res.json()

        if (data && data.Title) {
            return data.Title
        }

        return id // fallback
    } catch (err) {
        console.log("OMDb Error:", err)
        return id
    }
}

// ---------- Function to update Discord RPC ----------
async function updateRPC(data) {
    console.log("Received from Stremio:", data)

    const [imdb, season, episode] = data.id.split(':')

    const title = await getTitleFromIMDB(imdb)

    rpc.setActivity({
        details: `Watching: ${title}`,
        state: `Season ${season} • Episode ${episode}`,
        largeImageKey: "stremio",
        largeImageText: "Stremio",
        startTimestamp: Math.floor(data.timestamp / 1000)
    })

    console.log("RPC updated!")
}

// ---------- Endpoint for the addon ----------
app.post('/stremio-event', async (req, res) => {
    const data = req.body
    updateRPC(data)
    res.json({ ok: true })
})

// ---------- Start server ----------
rpc.on("ready", () => {
    console.log("✔ Discord RPC connected!")
    app.listen(41555, () => console.log("✔ Server listening on http://localhost:41555"))
})

rpc.login({ clientId }).catch(console.error)

