import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema({
  name: String,
  city: String,
  region: String,
  description: String,
  category: String,
  coverImage: String,
  entryFee: Object,
  visitDuration: String,
  // Add other fields as needed
});

const Site = mongoose.models.Site || mongoose.model('Site', siteSchema);
export default Site;
