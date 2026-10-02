async function searchMinecraftPlayer(gamertag) {
    const beUrl = `https://mc-api.io/uuid/${encodeURIComponent(gamertag)}/BEDROCK`;
    const javaUrl = `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(gamertag)}`;

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
        mcid = [...mcid, beData.name];
    }

    if (javaResponse.ok) {
        edition = "java";
        mcid = [...mcid, javaData.name];
    }

    if (beResponse.ok && javaResponse.ok) {
        edition = "both";
    }

    return {
        "edition": edition,
        "name": mcid
    }

}

module.exports = {
    searchMinecraftPlayer
};