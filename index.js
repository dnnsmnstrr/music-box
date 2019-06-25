require('dotenv').config();
const Octokit = require("@octokit/rest");
const fetch = require("node-fetch");

const {
    GIST_ID: gistID,
    GITHUB_TOKEN: githubToken,
    LASTFM_KEY: lfmAPI
} = process.env


const octokit = new Octokit({
    auth: `token ${githubToken}`
});

async function main() {

    const username = ''
    const gistID = ''

    const API = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${LASTFM_KEY}&format=json&period=7day`

    const data = await fetch(API);
    const json = await data.json();

    let gist;
    try {
      gist = await octokit.gists.get({ gist_id: gistID });
    } catch (error) {
        console.error(`music-box ran into an issue getting your Gist:\n${error}`);
    }


    var artist1 = {
        "name": "",
        "plays": ""
    }

    var artist2 = {
        "name": "",
        "plays": ""
    }

    var artist3 = {
        "name": "",
        "plays": ""
    }

    var artist4 = {
        "name": "",
        "plays": ""
    }

    artist1.name = json.topartists.artist[0].name
    artist1.plays = json.topartists.artist[0].playcount

    artist2.name = json.topartists.artist[1].name
    artist2.plays = json.topartists.artist[1].playcount

    artist3.name = json.topartists.artist[2].name
    artist3.plays = json.topartists.artist[2].playcount

    artist4.name = json.topartists.artist[3].name
    artist4.plays = json.topartists.artist[3].playcount

    // used for debugging
    // console.log(artist1.name, `-`, artist1.plays)
    // console.log(artist2.name, `-`, artist2.plays)
    // console.log(artist3.name, `-`, artist3.plays)
    // console.log(artist4.name, `-`, artist4.plays)

    const lines = [];

    const artist1line = [
        artist1.name.padEnd(15),
        generateBarChart(artist1.plays, 31),
        String(artist1.plays).padStart(6) + " plays"
    ];

    const artist2line = [
        artist2.name.padEnd(15),
        generateBarChart(artist2.plays, 31),
        String(artist2.plays).padStart(6) + " plays"
    ];

    const artist3line = [
        artist3.name.padEnd(15),
        generateBarChart(artist3.plays, 31),
        String(artist3.plays).padStart(6) + " plays"
    ];

    const artist4line = [
        artist4.name.padEnd(15),
        generateBarChart(artist4.plays, 31),
        String(artist4.plays).padStart(6) + " plays"
    ];

    lines.push(artist1line.join(" "), artist2line.join(" "), artist3line.join(" "), artist4line.join(" "));

    console.log(lines)

    try {
        // Get original filename to update that same file
        const filename = Object.keys(gist.data.files)[0];
        await octokit.gists.update({
          gist_id: gistID,
          files: {
            [filename]: {
              filename: `🎵 My last week in music`,
              content: lines.join("\n")
            }
          }
        });
      } catch (error) {
        console.error(`Unable to update gist\n${error}`);
      }
}

function generateBarChart(percent, size) {
    const empty = "░";
    const full = "█";
    const barsFull = Math.round(size * (percent / 100));
    return full.repeat(barsFull).padEnd(size, empty);
}

async function updateGist() {
    let gist;
    try {
        gist = await octokit.gists.get({ gist_id: gistID })
    } catch (error) {
        console.error(`music-box ran into an issue:\n${error}`);
    }
}

(async () => {
    await main();
  })();