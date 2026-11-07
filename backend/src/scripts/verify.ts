import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { SellerModel } from '../modules/seller/seller.model';
import { ProductModel } from '../modules/product/product.model';
import { ServiceModel } from '../modules/service/service.model';

const verify = async () => {
  try {
    await connectDB();

    const sellerCount = await SellerModel.countDocuments();
    const serviceCount = await ServiceModel.countDocuments();
    const productCount = await ProductModel.countDocuments();

    console.log(`Verified counts in database:`);
    console.log(`- Sellers: ${sellerCount}`);
    console.log(`- Services: ${serviceCount}`);
    console.log(`- Products: ${productCount}`);

    const randomSeller = await SellerModel.findOne();
    if (randomSeller) {
      console.log(`\nSample Seller:`);
      console.log(`- Name: ${randomSeller.salonName}`);
      console.log(`- Email: ${randomSeller.email}`);
      console.log(`- City: ${randomSeller.city}`);
    }

    const randomService = await ServiceModel.findOne();
    if (randomService) {
      console.log(`\nSample Service:`);
      console.log(`- Title: ${randomService.title}`);
      console.log(`- Category: ${randomService.category}`);
      console.log(`- Price: ${randomService.price}`);
    }

    const randomProduct = await ProductModel.findOne();
    if (randomProduct) {
      console.log(`\nSample Product:`);
      console.log(`- Name: ${randomProduct.name}`);
      console.log(`- Category: ${randomProduct.category}`);
      console.log(`- Price: ${randomProduct.price}`);
    }

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

void verify();
