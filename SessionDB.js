const db = require('./Config');

// Simpan session ke database
const saveSessionToDatabase = async (sessionId) => {
    try {
        await db('whatsapp_sessions')
            .insert({
                session_id: sessionId
            })
            .onConflict('session_id') // Jika session_id sudah ada
            .merge({
                updated_at: db.fn.now(),
            });
        console.log(`Session ${sessionId} saved successfully!`);
    } catch (error) {
        console.error(`Error saving session: ${error.message}`);
    }
};

// Muat session dari database
const loadSessionFromDatabase = async (sessionId) => {
    try {
        const session = await db('whatsapp_sessions')
            .select('session_id')
            .where({ session_id: sessionId })
            .first();
        return session
    } catch (error) {
        console.error(`Error loading session: ${error.message}`);
        return null;
    }
};

module.exports = {
    saveSessionToDatabase,
    loadSessionFromDatabase
};
