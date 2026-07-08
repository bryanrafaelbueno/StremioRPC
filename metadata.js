async function resolveMediaTitle(id, type = 'movie', config = {}) {
    const normalizedType = type === 'series' ? 'series' : 'movie';

    try {
        const stremioUrl = `https://v3-cinemeta.stremio.com/meta/${normalizedType}/${encodeURIComponent(id)}.json`;
        const response = await fetch(stremioUrl, {
            headers: { Accept: 'application/json' }
        });

        if (response && response.ok) {
            const data = await response.json();
            const meta = data?.meta || data;
            const title = meta?.name || meta?.title;
            if (title) {
                return title;
            }
        }
    } catch (err) {
        console.warn('Stremio metadata lookup failed:', err);
    }

    const omdbKey = config?.omdbApiKey;
    if (omdbKey) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=${omdbKey}&i=${encodeURIComponent(id)}`);
            if (response && response.ok) {
                const data = await response.json();
                if (data?.Title) {
                    return data.Title;
                }
            }
        } catch (err) {
            console.warn('OMDb lookup failed:', err);
        }
    }

    return id;
}

module.exports = {
    resolveMediaTitle
};
