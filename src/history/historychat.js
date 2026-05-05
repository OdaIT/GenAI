import generateResume from './taskService.js';
let users = [];

export function addToChatHistory(userName, userMessage, botResponse) {
    try {
        let existingUser = users.find(u => u.name === userName);
        if (!existingUser) {
            existingUser = { name: userName, history: [], resume: [] };
            users.push(existingUser);
        }
        existingUser.history.push({ user: userMessage, bot: botResponse });
    } catch (error) {
        console.error('Error in addToChatHistory:', error.message);
    }
}


export function getChatHistory(userName) {
    try {
        const existingUser = users.find(u => u.name === userName);
        if (!existingUser) throw new Error(`There's no history for that user`);
        return existingUser.history;
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

export async function resumeHistory(userName) {
    try {
        const existingUser = users.find(u => u.name === userName);
        if (!existingUser) throw new Error(`There's no history for that user`);
        if (existingUser.history.length > 40) {
            const resume = await generateResume(existingUser.history, existingUser.resume);
            existingUser.resume.push(resume);
            existingUser.history = [];
            return resume;
        }
    } catch (error) {
        console.error(error.message);
    }
}