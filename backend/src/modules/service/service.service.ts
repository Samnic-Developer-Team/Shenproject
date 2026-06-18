import { ApiError } from '../../utils/ApiError';
import { ServiceModel } from './service.model';

export const serviceService = {
  async create(payload: Record<string, unknown>) {
    return ServiceModel.create(payload);
  },

  async findAll(query: Record<string, unknown>) {
    return ServiceModel.find(query).sort({ createdAt: -1 }).lean();
  },

  async update(serviceId: string, payload: Record<string, unknown>) {
    const service = await ServiceModel.findByIdAndUpdate(serviceId, payload, { new: true });
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }
    return service;
  },

  async remove(serviceId: string) {
    const service = await ServiceModel.findByIdAndDelete(serviceId);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }
    return service;
  },
};
