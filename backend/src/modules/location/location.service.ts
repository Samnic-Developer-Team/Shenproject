import { LocationModel } from './location.model';
import { SellerModel } from '../seller/seller.model';
import { ApiError } from '../../utils/ApiError';

export const locationService = {
  async findAll(activeOnly = false) {
    const filter = activeOnly ? { isActive: true } : {};
    return LocationModel.find(filter).sort({ city: 1 }).lean();
  },

  async findShopownerLocations() {
    // Aggregate unique city + state combinations from sellers
    const rawLocations = await SellerModel.aggregate([
      {
        $group: {
          _id: {
            city: { $trim: { input: '$city' } },
            state: { $trim: { input: '$state' } }
          }
        }
      },
      {
        $project: {
          _id: 0,
          city: '$_id.city',
          state: '$_id.state'
        }
      },
      {
        $sort: { city: 1 }
      }
    ]);

    return rawLocations;
  },

  async create(payload: { city: string; state: string; isActive?: boolean }) {
    const city = payload.city.trim();
    const state = payload.state.trim();
    const isActive = payload.isActive !== undefined ? payload.isActive : true;

    // Case-insensitive duplicate check
    const existing = await LocationModel.findOne({
      city: { $regex: new RegExp(`^${city}$`, 'i') },
      state: { $regex: new RegExp(`^${state}$`, 'i') }
    });

    if (existing) {
      throw new ApiError(400, 'Location already exists');
    }

    return LocationModel.create({
      city,
      state,
      isActive
    });
  },

  async toggleActive(id: string) {
    const location = await LocationModel.findById(id);
    if (!location) {
      throw new ApiError(404, 'Location not found');
    }

    location.isActive = !location.isActive;
    await location.save();
    return location;
  },

  async delete(id: string) {
    const result = await LocationModel.findByIdAndDelete(id);
    if (!result) {
      throw new ApiError(404, 'Location not found');
    }
    return result;
  },

  async autoUpsert(city: string, state: string) {
    if (!city || !state) return;

    const trimmedCity = city.trim();
    const trimmedState = state.trim();

    // Check case-insensitively
    const existing = await LocationModel.findOne({
      city: { $regex: new RegExp(`^${trimmedCity}$`, 'i') },
      state: { $regex: new RegExp(`^${trimmedState}$`, 'i') }
    });

    if (!existing) {
      // Auto-insert as inactive (isActive: false) so admin can approve/activate it
      await LocationModel.create({
        city: trimmedCity,
        state: trimmedState,
        isActive: false
      });
    }
  }
};
