import { ApiError } from '../../utils/ApiError';
import { ServiceModel } from './service.model';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

export const serviceService = {
  async create(payload: Record<string, unknown>) {
    if (payload.image && typeof payload.image === 'string' && payload.image.startsWith('data:image')) {
      payload.image = await uploadToCloudinary(payload.image, 'services');
    }
    return ServiceModel.create(payload);
  },

  async findAll(query: Record<string, unknown>) {
    const { limit, page, sortBy, sortOrder, ...filters } = query;
    const mongooseQuery = ServiceModel.find(filters).populate('sellerId');
    if (limit) {
      mongooseQuery.limit(Number(limit));
    }
    if (page && limit) {
      mongooseQuery.skip((Number(page) - 1) * Number(limit));
    }
    const sortField = (sortBy as string) || 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    return mongooseQuery.sort({ [sortField]: order }).lean();
  },

  async update(serviceId: string, payload: Record<string, unknown>) {
    if (payload.image && typeof payload.image === 'string' && payload.image.startsWith('data:image')) {
      payload.image = await uploadToCloudinary(payload.image, 'services');
    }
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
