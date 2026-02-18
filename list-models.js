const fs = require('fs');
const https = require('https');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        const match = line.match(/^GEMINI_API_KEY=(.*)$/);
        if (match) {
            let value = match[1].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            apiKey = value;
            break;
        }
    }
} catch (e) {
    console.error('Error reading .env:', e);
    process.exit(1);
}

if (!apiKey) {
    console.error('GEMINI_API_KEY not found in .env');
    process.exit(1);
}

console.log(`Using API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('API Error:', JSON.stringify(json.error, null, 2));
            } else {
                console.log('Available Models for generateContent:');
                if (json.models) {
                    const models = json.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'));
                    models.forEach(m => console.log(`- ${m.name}`));
                    if (models.length === 0) console.log('No models found with generateContent support.');
                } else {
                    console.log('No models property in response:', JSON.stringify(json, null, 2));
                }
            }
        } catch (e) {
            console.error('Error parsing response:', e);
            console.log('Raw response:', data);
        }
    });
}).on('error', (e) => {
    console.error('Request error:', e);
});
