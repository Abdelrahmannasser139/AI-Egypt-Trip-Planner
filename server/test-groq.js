import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Test Groq API connection
async function testGroqAPI() {
  console.log('🧪 Testing Groq API Connection...');
  console.log('API Key:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');
  
  try {
    const response = await axios.post('https://api.groq.com/v1/chat/completions', {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with a simple greeting.'
        },
        {
          role: 'user',
          content: 'Hello, can you help me plan a trip to Egypt?'
        }
      ],
      temperature: 0.5,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Groq API Response:', response.data.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('❌ Groq API Error:', error.response?.data || error.message);
    return false;
  }
}

// Test MongoDB connection
async function testMongoDB() {
  console.log('\n🧪 Testing MongoDB Connection...');
  
  try {
    const mongoose = await import('mongoose');
    
    await mongoose.default.connect('mongodb+srv://abdelrahmannasser139:12345@cluster0.5ddi3ns.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB Connected Successfully');
    
    // Test a simple query
    const siteSchema = new mongoose.default.Schema({
      name: String,
      city: String,
      description: String,
      searchbyembedding: [Number]
    });
    
    const Site = mongoose.default.model('TestSite', siteSchema, 'sites');
    const siteCount = await Site.countDocuments();
    
    console.log(`✅ Found ${siteCount} sites in database`);
    
    await mongoose.default.disconnect();
    return true;
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Comprehensive System Tests\n');
  
  const groqResult = await testGroqAPI();
  const mongoResult = await testMongoDB();
  
  console.log('\n📊 Test Results:');
  console.log(`Groq API: ${groqResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`MongoDB: ${mongoResult ? '✅ PASS' : '❌ FAIL'}`);
  
  if (groqResult && mongoResult) {
    console.log('\n🎉 All systems operational!');
  } else {
    console.log('\n⚠️ Some systems need attention.');
  }
}

runTests().catch(console.error);
