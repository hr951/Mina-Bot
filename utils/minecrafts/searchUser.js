async function searchMinecraftPlayer(gamertag) {
    const beUrl = `https://playerdb.co/api/player/xbox/${encodeURIComponent(gamertag)}`;
    const javaUrl = `https://playerdb.co/api/player/minecraft/${encodeURIComponent(gamertag)}`;

    const beResponse = await fetch(beUrl);
    const javaResponse = await fetch(javaUrl);

    if (!beResponse.ok && !javaResponse.ok) {
        return {
            "edition": "none",
            "name": gamertag
        };
    }

    const beData = await beResponse.json();
    const javaData = await javaResponse.json();

    let edition = null;
    let mcid = [];

    if (beResponse.ok) {
        edition = "bedrock";
        mcid = [...mcid, beData.data.player.uniqueModernGamertag];
    }

    if (javaResponse.ok) {
        edition = "java";
        mcid = [...mcid, javaData.data.player.username];
    }

    if (beResponse.ok && javaResponse.ok) {
        edition = "both";
    }

    console.log({
        "edition": edition,
        "name": mcid
    })

    return {
        "edition": edition,
        "name": mcid
    }

}

module.exports = {
    searchMinecraftPlayer
};