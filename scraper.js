const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const config = require('./config');

mongoose.set('strictQuery', false);

mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Company schema
const companySchema = new mongoose.Schema({
    name: String,
    url: String,
    companyId: Number
}, { collection: 'companies' });  // Explicitly specify the collection name

// Define ProcessedID schema
const processedIDSchema = new mongoose.Schema({
    companyId: Number
});

const Company = mongoose.model('Company', companySchema);
const ProcessedID = mongoose.model('ProcessedID', processedIDSchema);

async function scrapeCompany(companyId) {
    const initialUrl = `${config.scrapeURL.replace(/\/\d+\/.*$/, '')}${companyId}`; // Base URL with company ID
    console.log(`initialUrl: ${initialUrl}`);
    
    try {
        const response = await axios.get(initialUrl, { maxRedirects: 5 });  // Allow up to 5 redirects
        const finalUrl = response.request.res.responseUrl;  // Capture the final URL after redirection
        console.log(`finalUrl: ${finalUrl}`);
        const html = response.data;
        const $ = cheerio.load(html);
        
        // Adjust this selector based on the actual HTML structure
        const companyName = $('h1').text().trim();

        if (companyName) {
            const company = new Company({
                name: companyName,
                url: finalUrl,  // Use the final URL after redirection
                companyId: companyId
            });
            await company.save();
            console.log(`Saved: ${companyName} (ID: ${companyId})`);
        }
        
        await ProcessedID.create({ companyId: companyId });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`ID ${companyId} not found (404)`);
        } else {
            console.log(`Error processing ID ${companyId}:`, error.message);
        }
    }
}


async function scrapeCompanies() {
    try {
        let processedCount = 0;
        let nextId = config.startID;

        while (processedCount < config.batchSize) {
            const isProcessed = await ProcessedID.findOne({ companyId: nextId });

            if (!isProcessed) {
                await scrapeCompany(nextId);
                processedCount++;
            }

            nextId++;  // Increment the ID even if 404 or error occurs
        }
        
        console.log(`Scraping completed. Processed ${processedCount} companies.`);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        mongoose.connection.close();
    }
}


scrapeCompanies();