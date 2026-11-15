class GameStorage {
    static STORAGE_KEY = "breakout_difficulty_top3_data";

    static loadData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                return {
                    name: parsed.name || "",
                    theme: parsed.theme || "dark",
                    muted: Boolean(parsed.muted),
                    // Stores top scores separately per difficulty level
                    leaderboards: parsed.leaderboards || {
                        easy: [],
                        normal: [],
                        hard: []
                    }
                };
            } catch (e) {
                console.error("Error parsing localStorage data", e);
            }
        }
        return {
            name: "",
            theme: "dark",
            muted: false,
            leaderboards: { easy: [], normal: [], hard: [] }
        };
    }

    static saveSettings({ name, theme, muted }) {
        const current = this.loadData();
        const updated = {
            ...current,
            name: name !== undefined ? name : current.name,
            theme: theme !== undefined ? theme : current.theme,
            muted: muted !== undefined ? muted : current.muted
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }

    static recordScore(name, score, difficulty) {
        const roundedScore = Math.round(score);
        if (roundedScore <= 0) return this.loadData().leaderboards;

        const current = this.loadData();
        const diffScores = current.leaderboards[difficulty] || [];

        // Add new score, sort descending, and slice to top 3 only
        const updatedDiffScores = [
            ...diffScores,
            { name, score: roundedScore }
        ]
            .sort((a, b) => b.score - a.score)
            .slice(0, 3); // Discards any score lower than the top 3 for this mode

        current.leaderboards[difficulty] = updatedDiffScores;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
        return current.leaderboards;
    }
}