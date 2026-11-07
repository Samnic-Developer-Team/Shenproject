import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { SellerModel } from '../modules/seller/seller.model';
import { ProductModel } from '../modules/product/product.model';
import { ServiceModel } from '../modules/service/service.model';
import { AuthUserModel } from '../modules/auth/auth.model';
import { UserModel } from '../modules/user/user.model';
import { LocationModel } from '../modules/location/location.model';

const SELLER_PASSWORD = 'password123';
const DEFAULT_PASSWORD = 'password123';
const ADMIN_PASSWORD = 'admin123';

const dummySellers = [
  {
    salonName: 'Aura Wellness Salon & Spa',
    ownerName: 'John Doe',
    contact: '9876543210',
    email: 'seller1@example.com',
    address: 'Ganga Market, Near Clock Tower',
    city: 'Itanagar',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-1',
    shopImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600',
    bio: 'Discover a haven of peace and beauty at Aura Wellness. We specialize in organic therapies and professional hair styling to rejuvenate your mind and body.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
  {
    salonName: 'The Grooming Lounge',
    ownerName: 'Jane Smith',
    contact: '9876543211',
    email: 'seller2@example.com',
    address: 'Daily Market, Sector 3',
    city: 'Naharlagun',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-2',
    shopImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600',
    bio: 'Premium grooming services for the modern gentleman. Precision haircuts, beard styling, and skincare treatments tailored just for men.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
  {
    salonName: 'Blush & Co. Makeup Studio',
    ownerName: 'Aria Bennett',
    contact: '9876543212',
    email: 'seller3@example.com',
    address: 'Gumin Nagar, Lower Market',
    city: 'Pasighat',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-3',
    shopImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600',
    bio: 'Providing high-end makeup services for weddings, parties, and editorial shoots. Get flawless makeup that showcases your natural beauty.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
  {
    salonName: 'Nail Oasis Spa',
    ownerName: 'Chloe Davis',
    contact: '9876543213',
    email: 'seller4@example.com',
    address: 'Hapoli, Near Post Office',
    city: 'Ziro',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-4',
    shopImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600',
    bio: 'Indulge in luxury nail care, creative nail art, and relaxing pedicures. Your hands and feet deserve the ultimate pampering.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
  {
    salonName: 'Velvet Touch Beauty Salon',
    ownerName: 'Ethan Evans',
    contact: '9876543214',
    email: 'seller5@example.com',
    address: 'Old Market Road',
    city: 'Tawang',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-5',
    shopImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    bio: 'From hair spas to glowing facials, Velvet Touch offers comprehensive beauty services tailored to enhance your individual style.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
  {
    salonName: 'Rejuvenate Skin & Laser Clinic',
    ownerName: 'Fiona Green',
    contact: '9876543215',
    email: 'seller6@example.com',
    address: 'Main Bazar',
    city: 'Bomdila',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-6',
    shopImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
    bio: 'Advanced clinical skincare and anti-aging treatments directed by professional therapists. Restoring skin health with scientific solutions.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
  {
    salonName: 'Serene Hair & Day Spa',
    ownerName: 'Gavin Harris',
    contact: '9876543216',
    email: 'seller7@example.com',
    address: 'Amuguri Road',
    city: 'Tezu',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-7',
    shopImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    bio: 'Unwind and recharge at Serene Spa. Enjoy premium haircuts, oil massages, and soothing foot reflexology sessions.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
  {
    salonName: 'Elite Style Unisex Salon',
    ownerName: 'Isabella Jackson',
    contact: '9876543217',
    email: 'seller8@example.com',
    address: 'Buddha Vihar Area',
    city: 'Namsai',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-8',
    shopImage: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600',
    bio: 'A trendsetting salon offering premium Balayage coloring, Keratin smoothing, and personalized skincare for all.',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
  {
    salonName: 'Royal Grooming Parlour',
    ownerName: 'Jack King',
    contact: '9876543218',
    email: 'seller9@example.com',
    address: 'New Market',
    city: 'Aalo',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-9',
    shopImage: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=600',
    bio: 'Experience royal grooming with our heritage head massages, herbal facials, and classic straight-razor hot towel shaves.',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
  {
    salonName: 'Miracle Beauty & Wellness',
    ownerName: 'Lily Lewis',
    contact: '9876543219',
    email: 'seller10@example.com',
    address: 'Ering Colony',
    city: 'Roing',
    state: 'Arunachal Pradesh',
    shopLicence: 'LIC-SELLER-10',
    shopImage: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=600',
    bio: 'Specializing in long-lasting hair smoothing, hydrating clinical HydraFacials, and stunning gel nail art design.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    isApproved: true,
    isActive: true,
  },
];

const dummyServicesTemplate = [
  {
    title: 'Precision Haircut & Styling',
    description: 'Expert customized haircut styled with our signature blowout finish.',
    category: 'hair',
    duration: 45,
    price: 1200,
    benefits: 'Enhances hair shape, removes split ends, and adds high-volume shine.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR1DXk_kWir6pXEXSy91OTlXazy8zvfCegg2E-z4_Z0tY3Ai8moe0q0qlj_OFocJTBsCdo5ryT3kzg-KjNopdAl5DUjfUxPcNoBe-sPOAyeIKaaMddVxqzifvI1wY7JmgY69Ze_UIvIbGVARyqaVaI7xriJykX-JpU72EZvzOmn9Bb7ECZahpz36QzbT9dQWNVwml-Le_fmrj-ptzaEUTOwIOo3GRV_lMNwIlK4x_YEu1vfnFe3wUR5ZGtyOUQi_hGoyErBPDdYQ',
    subCategory: 'Haircut',
    fullDescription: 'Our senior stylist discusses your desired look and facial shape to craft a custom cut. Includes shampoo, scalp massage, and a professional blowout with styling products.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    gender: 'Unisex' as const,
    status: 'Active' as const,
    homeServiceAvailable: false,
    featuredService: true,
  },
  {
    title: 'Signature HydraFacial',
    description: 'Deep clinical cleaning, exfoliation, and hydration infusion therapy.',
    category: 'skin',
    duration: 60,
    price: 3200,
    benefits: 'Instantly brightens, cleans clogged pores, and infuses essential peptides.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvogHbH43DI-fdsaHWns74l1GrhkMjcvtFrelvPcrwhaM51IrVFEwWVTQjEQObZGagsDcAbxa5y4S_5byGHazSaJyLWZyjvDDvOQj9qXeLLSMvmLghPfIJ77L-zJf03VTQxS4svKFifQbGkRU4BmXCIbkB0NbISst2wFfwkT9xWpaLn3x18HQ3oBV_wR5nG2T7rlaYwuWgeMNwPDqKyeoPYGqtEoO_QYrzHU2t4dvkGduc0HEug3_rk8hm8E3wCVLofO8Hmqq6aQ',
    subCategory: 'Facial',
    fullDescription: 'A multi-step treatment utilizing patented technology to cleanse, exfoliate, extract impurities, and hydrate skin using super serums loaded with antioxidants and hyaluronic acid.',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    gender: 'Women' as const,
    status: 'Active' as const,
    homeServiceAvailable: true,
    featuredService: true,
  },
  {
    title: 'Aromatherapy Deep Tissue Massage',
    description: 'Stress-relieving deep muscle massage infused with customized essential oils.',
    category: 'wellness',
    duration: 75,
    price: 3800,
    benefits: 'Releases chronic muscle tension, increases blood flow, and reduces mental fatigue.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeGq7w5WaiWZ4lL29bSCsHhQpvGt0bjprNzO-YhMh8qtjQn4njbibnGkn4opxldpNHnmVqihrBos6UQhY96iACNar_jzn-t7_GbsYk7nfq81x8bcbyMMqQ0kFNKgpVNhH3EsRYUtJ3mZPzwL11jdlk-7XclD1fXoYlsTXJCN9Enyp8uPSOZtN9k32ZDUVKaavGQ6jhi2gQMKREA14w7H3MqZ8zvp6F4c5JkwhX42zwOUOAmCxmkaaw0J2Enfu5Tz1aqgUrr63EXw',
    subCategory: 'Massage',
    fullDescription: 'Targeting deep layers of muscle tissue and fascia, this massage combines slow strokes and intense pressure with aromatherapy oils selected to soothe and heal.',
    availableDays: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    gender: 'Unisex' as const,
    status: 'Active' as const,
    homeServiceAvailable: false,
    featuredService: false,
  },
  {
    title: 'Gel Manicure & Nail Art',
    description: 'Premium long-lasting gel coating with hand-painted luxury nail designs.',
    category: 'nails',
    duration: 60,
    price: 1500,
    benefits: 'Chip-free color for up to 3 weeks, strengthens nails, and displays unique artwork.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5-3wMhRHQcHGGF9k1MUU8BGw2rPfKUmvCL9mp_dhCOgCWuaNBax5XiGGHod0ni82c5taAT0Z-bJ50wfABImyARrp-r_Ysz761r86RBq-clCk-UGRyjSAD8US-UbgwPlnR2casdpoQYhAJApirRhMXlxmAYwrm_2_F230cBEcVRT2ps1-HLVl0hJ9MOFvNRb8O7DDx16cXHdPEzuDAodqsqoB0_8I3Wvj3XGdkZRDb0c6uDFkBkIKpdhMpHYT7jLDJwUNj0i1GZA',
    subCategory: 'Manicure',
    fullDescription: 'Nail shaping, cuticle grooming, gel base/polish application cured under LED light. Finished with custom hand-painted nail art on two accent fingers and nourishing hand lotion.',
    availableDays: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    gender: 'Women' as const,
    status: 'Active' as const,
    homeServiceAvailable: true,
    featuredService: false,
  },
  {
    title: 'Bridal Glam Makeup',
    description: 'Occasion-ready luxury airbrush makeup and professional lash application.',
    category: 'makeup',
    duration: 120,
    price: 8000,
    benefits: 'High-definition photo-ready finish, lightweight feel, and 16-hour long wear.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8nL1_3IxnyvNgUTwsIwUJmsgbZAySnZaWnCgE2YjstNZ6QaKJ3v2ONqfjWHvmpcAMqtJaVk6CNhDuzbMywgU4oyFyIoMz0HcKiQpYWAFC02j5E-L4I03zhHhGhfCm8-JKrJ6oOw2gH4MlwPwIrAnRWk0KaPN1ayxKhabPBr2rFQDGQXL1b5WcmtRTxQYJNxJC7K05GvFJfdLvy9eroEbSyVWu_P-0_6VhIpf9HUn3c0tgEevWvW6PEr-IlIrjwf1Sdg7_vuoLWg',
    subCategory: 'Makeup Session',
    fullDescription: 'Complete luxury makeup application utilizing airbrush foundations, precision highlighting/contouring, premium eyeshadows, eyeliner, and customized mink faux eyelashes.',
    availableDays: ['Friday', 'Saturday', 'Sunday'],
    gender: 'Women' as const,
    status: 'Active' as const,
    homeServiceAvailable: true,
    featuredService: true,
  },
];

const dummyProductsTemplate = [
  {
    name: 'No. 3 Hair Perfector',
    brand: 'Olaplex',
    description: 'A global best-seller. It is an at-home weekly treatment, not a conditioner, that reduces breakage and visibly strengthens hair.',
    category: 'haircare',
    price: 2800,
    stock: 25,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTiZkBArq0KoSUCTCCNizTzBLU55r_VJOaY7XOUaZwwW2HzdfNKtzX8QfShDGVN6aA5WGu2aOk0MdR70LNX0vZvMeXN8FBI6Hvf3FQElGLXFA0nBgjiXyrEFSoruadIvwSjTvLKyh7PncYkPejreKrjmkJcLEk_fI8BcAd4tyYARXmc_mXb0UiGmhSQGhuGYJJKIQDSe49j0tW1ajrIE3Xy_iZ2kEdfsbEfYy-RtAIbiwiUD4Guh-x4wS9ekVKh9mCOxAQ8WPOvA',
    ratings: 4.8,
    size: '100ml',
    ingredients: 'Water (Aqua/Eau), Bis-Aminopropyl Diglycol Dimaleate, Propylene Glycol, Cetearyl Alcohol, Behentrimonium Methosulfate, Cetyl Alcohol, Phenoxyethanol.',
    howToUse: 'Apply a generous amount from roots to ends on damp, unwashed hair. Comb through once and leave on for a minimum of 10 minutes. Rinse from hair, shampoo and condition.',
    subCategory: 'Treatment',
    productType: 'Cream',
    mrp: 3400,
    discount: 17,
    status: 'Active' as const,
    fullDescription: 'Nourish and repair dry, brittle hair with the bond-building power of Olaplex. Re-links broken disulfide bonds to dramatically improve hair health, texture, and strength.',
    tags: ['hair repair', 'bond builder', 'olaplex'],
    weight: '150g',
    shippingCharge: 100,
  },
  {
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    description: 'High-strength vitamin and mineral blemish formula targets breakout activity and balances visible sebum activity.',
    category: 'skincare',
    price: 600,
    stock: 50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_j8JKAVpwBai7TqJ4LK-MHlzGdoOWVsJ1if9UU4Hf7fMNk_Cuk13IP0SN-ePoADTwGcPz2rB4-gVxaivYJ-4Yj8ASxGJdHhVP_bxAcixm4zFgR40cewmfZrjVjO7v_7ht_ATv2jxL-Xwk-NWvgF5mulXYJd1WgM3HR9SWGUjQmpTca2udaAs0RPLc05qmibaWhUiyP0GK8kFjnrITiariLTYYGLTrebWE2iz8QUybNl6y989ObWHxJfcyH3sckYhf2SDIeAIw0A',
    ratings: 4.7,
    size: '30ml',
    ingredients: 'Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol.',
    howToUse: 'Apply to entire face morning and evening before heavier creams.',
    subCategory: 'Serum',
    productType: 'Liquid',
    mrp: 650,
    discount: 7,
    status: 'Active' as const,
    fullDescription: 'Niacinamide (Vitamin B3) is indicated to reduce the appearance of skin blemishes and congestion. A high 10% concentration of this vitamin is supported in the formula by zinc salt of pyrrolidone carboxylic acid to balance visible aspects of sebum activity.',
    tags: ['anti-acne', 'glow', 'oil-control'],
    weight: '90g',
    shippingCharge: 50,
  },
  {
    name: 'Matte Revolution Lipstick',
    brand: 'Charlotte Tilbury',
    description: 'This matte lipstick features a long-lasting, buildable, and hydrating formula.',
    category: 'makeup',
    price: 2950,
    stock: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8nL1_3IxnyvNgUTwsIwUJmsgbZAySnZaWnCgE2YjstNZ6QaKJ3v2ONqfjWHvmpcAMqtJaVk6CNhDuzbMywgU4oyFyIoMz0HcKiQpYWAFC02j5E-L4I03zhHhGhfCm8-JKrJ6oOw2gH4MlwPwIrAnRWk0KaPN1ayxKhabPBr2rFQDGQXL1b5WcmtRTxQYJNxJC7K05GvFJfdLvy9eroEbSyVWu_P-0_6VhIpf9HUn3c0tgEevWvW6PEr-IlIrjwf1Sdg7_vuoLWg',
    ratings: 4.9,
    size: '3.5g',
    ingredients: 'Neopentyl Glycol Dicaprylate/Dicaprate, Trimethylolpropane Triisostearate, Dimethicone, Cera Microcristallina/Microcrystalline Wax/Cire Microcristalline, Polyethylene.',
    howToUse: 'Apply directly to lips from the bullet or use a lip brush for extra precision.',
    subCategory: 'Lips',
    productType: 'Bullet',
    mrp: 3200,
    discount: 7,
    status: 'Active' as const,
    fullDescription: 'Charlotte Tilbury\'s Matte Revolution Lipstick is the secret to a full, luminous, and hydrated pout. The bullet features a square, angled tip that mimics a lip brush.',
    tags: ['lipstick', 'matte', 'makeup'],
    weight: '30g',
    shippingCharge: 60,
  },
  {
    name: 'Infinite Shine - Big Apple Red',
    brand: 'OPI',
    description: 'A vibrant red nail lacquer that provides up to 11 days of gel-like wear and shine.',
    category: 'nails',
    price: 950,
    stock: 40,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXu5-3wMhRHQcHGGF9k1MUU8BGw2rPfKUmvCL9mp_dhCOgCWuaNBax5XiGGHod0ni82c5taAT0Z-bJ50wfABImyARrp-r_Ysz761r86RBq-clCk-UGRyjSAD8US-UbgwPlnR2casdpoQYhAJApirRhMXlxmAYwrm_2_F230cBEcVRT2ps1-HLVl0hJ9MOFvNRb8O7DDx16cXHdPEzuDAodqsqoB0_8I3Wvj3XGdkZRDb0c6uDFkBkIKpdhMpHYT7jLDJwUNj0i1GZA',
    ratings: 4.6,
    size: '15ml',
    ingredients: 'Ethyl Acetate, Butyl Acetate, Nitrocellulose, Acetyl Tributyl Citrate, Adipic Acid/Neopentyl Glycol/Trimellitic Anhydride Copolymer, Isopropyl Alcohol.',
    howToUse: 'Apply one coat of base coat, follow with two thin coats of color lacquer, and finish with one coat of top coat.',
    subCategory: 'Nail Polish',
    productType: 'Lacquer',
    mrp: 1100,
    discount: 13,
    status: 'Active' as const,
    fullDescription: 'Get gel-like shine and wear without the light with OPI Infinite Shine. Offers a long-wearing, high-gloss finish that removes easily with regular polish remover.',
    tags: ['red nails', 'high shine', 'nail polish'],
    weight: '50g',
    shippingCharge: 40,
  },
  {
    name: 'Anthelios UVMune 400',
    brand: 'La Roche-Posay',
    description: 'Extremely high UVA/UVB facial sun protection in a fragrance-free, fluid texture.',
    category: 'skincare',
    price: 1850,
    stock: 30,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdq5E6q34h4JcdF25_URSIiZBgZjPkP5U0taERbMN6TWxwkfS4pCEmBdIpOCq18LrdiNDv0QFZ9QJfvU6aEZcCeYUwlOl61zuSzZzGRDVeTR_nkYFga5t3ZQpBREf9FjxTfl__wY_gblteKLpwkSic2Lb0Hq5LuBm7zxumIMt9NBQT6SSOt9o8kXu7Qb4S6mdKY2BmO-nciaS_1UVfBFRsfKvLta2cvftex1BiOoGIKz64uAXbSdjQCjgHtap5dn1_BD8CkDwLvA',
    ratings: 4.8,
    size: '50ml',
    ingredients: 'Aqua/Water/Eau, Alcohol Denat., Triethyl Citrate, Diisopropyl Sebacate, Silica, Ethylhexyl Salicylate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine.',
    howToUse: 'Shake well before use. Apply generously before sun exposure and reapply frequently, especially after swimming or sweating.',
    subCategory: 'Sunscreen',
    productType: 'Liquid',
    mrp: 1950,
    discount: 5,
    status: 'Active' as const,
    fullDescription: 'Anthelios UVMune 400 Invisible Fluid SPF50+ is our ultimate protection with ultra-long UVA filter. Protects against deep cell damage.',
    tags: ['sunscreen', 'skincare', 'spf50'],
    weight: '75g',
    shippingCharge: 50,
  },
  {
    name: "Elixir Ultime L'Original Hair Oil",
    brand: 'Kérastase',
    description: 'A multi-use hair oil made for all hair types to seek optimal shine and nutrition.',
    category: 'haircare',
    price: 4200,
    stock: 20,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeGq7w5WaiWZ4lL29bSCsHhQpvGt0bjprNzO-YhMh8qtjQn4njbibnGkn4opxldpNHnmVqihrBos6UQhY96iACNar_jzn-t7_GbsYk7nfq81x8bcbyMMqQ0kFNKgpVNhH3EsRYUtJ3mZPzwL11jdlk-7XclD1fXoYlsTXJCN9Enyp8uPSOZtN9k32ZDUVKaavGQ6jhi2gQMKREA14w7H3MqZ8zvp6F4c5JkwhX42zwOUOAmCxmkaaw0J2Enfu5Tz1aqgUrr63EXw',
    ratings: 4.9,
    size: '100ml',
    ingredients: 'Cyclopentasiloxane, Dimethiconol, Zea Mays Germ Oil/Corn Germ Oil, Argania Spinosa Kernel Oil, Sclerocarya Birrea Seed Oil, Camellia Oleifera Seed Oil.',
    howToUse: 'Apply 1 or 2 pumps on wet or dry hair, as a leave-in treatment. Style as desired.',
    subCategory: 'Serum',
    productType: 'Oil',
    mrp: 4500,
    discount: 6,
    status: 'Active' as const,
    fullDescription: 'Infused with a blend of precious hair oils (marula, camellia, argan, maize germ), this nourishing oil provides long-lasting frizz control and heat protection up to 230°C.',
    tags: ['hair oil', 'shine', 'kerastase'],
    weight: '220g',
    shippingCharge: 80,
  },
  {
    name: 'Empowered Palette',
    brand: 'Huda Beauty',
    description: 'The ultimate everyday palette. Build your look with 18 gorgeous shades in 5 easy-to-use textures.',
    category: 'makeup',
    price: 4500,
    stock: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3qi_IGxWjsFp2EknNv2N93GX8GPD28qmENcDCIVvNwRQRwII1bhrCxcm5h8BUGISLL2kgBMoBzXeHckiALF153oMJ7pijP9_IR36d6HTW4dX1Hhhb4CS0Hx1_qMHojdhg3auXwveo6RiCzIUXOud2aC7puAxwEB9Bnkd5sq-x6gJzOZq_MbJxYwXauYtkqIJZdkhPnylB3BCC2hWO7AzsApnYEAsuqd4GYtmwxA7PeLQGzEtO2EWbT1anVYCnmH_AY-wcuwR25w',
    ratings: 5.0,
    size: '18g',
    ingredients: 'Mica, Talc, Zinc Stearate, Dimethicone, Octyldodecyl Stearoyl Stearate, Nylon-12, Silica, Lauroyl Lysine.',
    howToUse: 'Build your base with matte shadows, apply shimmers with a brush or finger for a metallic finish, and top with gel liners.',
    subCategory: 'Eyes',
    productType: 'Palette',
    mrp: 5900,
    discount: 23,
    status: 'Active' as const,
    fullDescription: 'Take your power back with this luxurious range of buttery-smooth gold, copper, brown, and neutral eyeshadows, featuring hyper-metallic shimmers, wet-look glosses, and rich gel liners.',
    tags: ['eyeshadow', 'glam', 'palette'],
    weight: '110g',
    shippingCharge: 70,
  },
  {
    name: 'Hydrating Facial Cleanser',
    brand: 'CeraVe',
    description: 'Cleanses, hydrates and helps restore the protective skin barrier with three essential ceramides.',
    category: 'skincare',
    price: 1250,
    stock: 45,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk1ZBrCZeSW788G8ubX94uqqGuwE6h7Hn0qBZK2fB9Rl1FMFDkrvLOm3K3jaT5RpBmxBfoK09__KDkHveqXcWzVJxoAib2QuIzUU1FaJD4znxu_9qCVz6WLcID_otScmxuvjCIml8rytppBvHfyEb1kqJ6tydUvVV3Zoe69Rq6jFVYeWl7VYcJlarBF81K28CmbjVC8CcDMjqzxWXcJxBICwTuG6qyrU47v3cQdLCXTmXZD92OPKUDTy4I5leeer2-jFuYnG9U_w',
    ratings: 4.8,
    size: '236ml',
    ingredients: 'Aqua/Water, Glycerin, Cetearyl Alcohol, Phenoxyethanol, Stearyl Alcohol, Cetyl Alcohol, Peg-40 Stearate, Behentrimonium Methosulfate, Ceramide NP, Ceramide AP, Ceramide EOP.',
    howToUse: 'Wet skin with lukewarm water. Massage cleanser into skin in a gentle, circular motion. Rinse.',
    subCategory: 'Cleanser',
    productType: 'Cream',
    mrp: 1350,
    discount: 7,
    status: 'Active' as const,
    fullDescription: 'CeraVe Hydrating Facial Cleanser is a gentle face wash with ingredients like ceramides and hyaluronic acid that work to restore the skin’s natural barrier to help the skin lock in moisture.',
    tags: ['cleanser', 'skincare', 'dry skin'],
    weight: '300g',
    shippingCharge: 60,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing collections...');
    await SellerModel.deleteMany({});
    await ServiceModel.deleteMany({});
    await ProductModel.deleteMany({});
    await AuthUserModel.deleteMany({});
    await UserModel.deleteMany({});
    await LocationModel.deleteMany({});
    console.log('Collections cleared successfully!');

    // Hash passwords
    const hashedSellerPassword = await bcrypt.hash(SELLER_PASSWORD, 12);
    const hashedDefaultPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);
    const hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    console.log('Hashed passwords successfully.');

    // Seed Admin in AuthUserModel
    const adminUser = await AuthUserModel.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
      isActive: true,
    });
    console.log(`Seeded Admin User: ${adminUser.email}`);

    // Seed Default Customer User in AuthUserModel and UserModel
    const customerAuth = await AuthUserModel.create({
      name: 'Test Customer',
      email: 'user@example.com',
      password: hashedDefaultPassword,
      role: 'USER',
      isActive: true,
    });

    const customerProfile = await UserModel.create({
      _id: customerAuth._id,
      name: 'Test Customer',
      email: 'user@example.com',
      password: hashedDefaultPassword,
      role: 'USER',
      isActive: true,
    });
    console.log(`Seeded Customer User Profile: ${customerProfile.email}`);

    const createdSellers = [];

    // Create Sellers & their matching AuthUser accounts
    for (let i = 0; i < dummySellers.length; i++) {
      const sellerData = dummySellers[i];
      
      // First create AuthUser credentials
      const authSeller = await AuthUserModel.create({
        name: sellerData.ownerName,
        email: sellerData.email,
        password: hashedSellerPassword,
        role: 'SELLER',
        isActive: true,
      });

      // Then create Seller profile with the same or auto-generated _id
      const newSeller = new SellerModel({
        ...sellerData,
        password: hashedSellerPassword,
      });
      const savedSeller = await newSeller.save();
      createdSellers.push(savedSeller);
      console.log(`Seeded Seller [${i + 1}/10]: ${savedSeller.salonName} (Auth ID: ${authSeller._id})`);
    }

    // Seed LocationModel with unique dummySellers locations
    const uniqueLocations = Array.from(
      new Set(dummySellers.map(s => `${s.city}|${s.state}`))
    ).map(locStr => {
      const [city, state] = locStr.split('|');
      return { city, state, isActive: true };
    });
    await LocationModel.insertMany(uniqueLocations);
    console.log(`Seeded ${uniqueLocations.length} locations in LocationModel`);

    let serviceCount = 0;
    let productCount = 0;

    // For each seller, create associated services and products
    for (let i = 0; i < createdSellers.length; i++) {
      const seller = createdSellers[i];

      // Assign all 5 services to this seller
      for (const serviceTpl of dummyServicesTemplate) {
        const newService = new ServiceModel({
          ...serviceTpl,
          sellerId: seller._id,
          images: [{ url: serviceTpl.image }],
        });
        await newService.save();
        serviceCount++;
      }

      // Assign all 8 products to this seller
      for (const productTpl of dummyProductsTemplate) {
        const newProduct = new ProductModel({
          ...productTpl,
          sellerId: seller._id,
          images: [{ url: productTpl.image }],
        });
        await newProduct.save();
        productCount++;
      }

      console.log(`Seeded services and products for: ${seller.salonName}`);
    }

    console.log('\n--- SEEDING COMPLETED SUCCESSFULY ---');
    console.log(`Total Sellers Seeded:  ${createdSellers.length}`);
    console.log(`Total Services Seeded: ${serviceCount}`);
    console.log(`Total Products Seeded: ${productCount}`);
    console.log('-------------------------------------\n');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

void seedDatabase();
