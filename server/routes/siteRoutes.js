import express from 'express';
const router = express.Router();

import Site from '../models/Site.js';
import { Restaurant, haversineDistance } from '../services/groqTripPlannerService.js';

// GET /api/sites - Get all tourism sites with distances
router.get('/', async (req, res) => {
  try {
    const sites = await Site.find();
    const restaurants = await Restaurant.find();

    // For each site, calculate distances to all other sites and all restaurants
    const sitesWithDistances = sites.map(site => {
      // Distance to other sites
      const siteDistances = sites
        .filter(s => s._id.toString() !== site._id.toString())
        .map(otherSite => ({
          siteId: otherSite._id,
          name: otherSite.name,
          distance_km: haversineDistance(
            { latitude: site.latitude, longitude: site.longitude },
            { latitude: otherSite.latitude, longitude: otherSite.longitude }
          )
        }));

      // Distance to all restaurants
      const restaurantDistances = restaurants.map(rest => ({
        restaurantId: rest._id,
        name: rest.name,
        distance_km: haversineDistance(
          { latitude: site.latitude, longitude: site.longitude },
          { latitude: rest.latitude, longitude: rest.longitude }
        )
      }));

      return {
        ...site.toObject(),
        distances_to_sites: siteDistances,
        distances_to_restaurants: restaurantDistances,
      };
    });

    res.json(sitesWithDistances);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sites with distances' });
  }
});

export default router;
