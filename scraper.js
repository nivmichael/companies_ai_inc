const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const config = require('./config');

// MongoDB connection string (adjust as needed)
const mongoURI = config.mongoURI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Company schema
const companySchema = new mongoose.Schema({
  name: String
});

const Company = mongoose.model('Company', companySchema);

// URL of the website to scrape (replace with the actual URL)
const url = config.scrapeURL;

async function scrapeCompanies() {
  try {
    // Fetch the HTML content
    const response = await axios.get(url);
    const html = response.data;

    // Parse the HTML with Cheerio
    const $ = cheerio.load(html);
    
    // Select and extract company names (adjust the selector as needed)
    const companies = [];
    $('h1').each((index, element) => {
      companies.push($(element).text().trim());
    });
    console.log(companies);

    // Save companies to MongoDB
    for (const companyName of companies) {
      const company = new Company({ name: companyName });
      await company.save();
      console.log(`Saved: ${companyName}`);
    }

    console.log('Scraping completed');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the scraper
scrapeCompanies();