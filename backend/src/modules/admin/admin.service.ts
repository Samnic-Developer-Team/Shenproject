import { AdminModel } from './admin.model';

export const adminService = {
  async findAll() {
    return AdminModel.find().sort({ createdAt: -1 }).lean();
  },
};
