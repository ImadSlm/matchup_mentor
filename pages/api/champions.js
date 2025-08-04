import axios from 'axios';

export default async function handler(req, res) {
  try {
    const versionsRes = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versionsRes.data[0];

    const champsRes = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
    const champions = Object.values(champsRes.data.data).map(champ => champ.name);

    res.status(200).json({ version: latestVersion, champions });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du fetch des champions' });
  }
}