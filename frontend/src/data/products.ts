import type { Product } from "@/types/product.types";

export const products: Product[] = [
  {
    id: "1",
    slug: "olaplex-no-3-hair-perfector",
    brand: "Olaplex",
    name: "No. 3 Hair Perfector",
    title: "No. 3 Hair Perfector",
    price: 2800,
    oldPrice: 3400,
    isSale: true,
    category: "haircare",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTiZkBArq0KoSUCTCCNizTzBLU55r_VJOaY7XOUaZwwW2HzdfNKtzX8QfShDGVN6aA5WGu2aOk0MdR70LNX0vZvMeXN8FBI6Hvf3FQElGLXFA0nBgjiXyrEFSoruadIvwSjTvLKyh7PncYkPejreKrjmkJcLEk_fI8BcAd4tyYARXmc_mXb0UiGmhSQGhuGYJJKIQDSe49j0tW1ajrIE3Xy_iZ2kEdfsbEfYy-RtAIbiwiUD4Guh-x4wS9ekVKh9mCOxAQ8WPOvA",
    description: "Minimalist white bottle of Olaplex No. 3 Hair Perfector on a clean white surface with soft shadows"
  },
  {
    id: "2",
    slug: "niacinamide-10-zinc-1",
    brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1%",
    title: "Niacinamide 10% + Zinc 1%",
    price: 600,
    isSale: false,
    category: "skincare",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_j8JKAVpwBai7TqJ4LK-MHlzGdoOWVsJ1if9UU4Hf7fMNk_Cuk13IP0SN-ePoADTwGcPz2rB4-gVxaivYJ-4Yj8ASxGJdHhVP_bxAcixm4zFgR40cewmfZrjVjO7v_7ht_ATv2jxL-Xwk-NWvgF5mulXYJd1WgM3HR9SWGUjQmpTca2udaAs0RPLc05qmibaWhUiyP0GK8kFjnrITiariLTYYGLTrebWE2iz8QUybNl6y989ObWHxJfcyH3sckYhf2SDIeAIw0A",
    description: "Elegant glass dropper bottle with amber serum standing on a marble pedestal, editorial lighting"
  },
  {
    id: "3",
    slug: "matte-revolution",
    brand: "Charlotte Tilbury",
    name: "Matte Revolution",
    title: "Matte Revolution",
    price: 2950,
    isSale: false,
    category: "makeup",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8nL1_3IxnyvNgUTwsIwUJmsgbZAySnZaWnCgE2YjstNZ6QaKJ3v2ONqfjWHvmpcAMqtJaVk6CNhDuzbMywgU4oyFyIoMz0HcKiQpYWAFC02j5E-L4I03zhHhGhfCm8-JKrJ6oOw2gH4MlwPwIrAnRWk0KaPN1ayxKhabPBr2rFQDGQXL1b5WcmtRTxQYJNxJC7K05GvFJfdLvy9eroEbSyVWu_P-0_6VhIpf9HUn3c0tgEevWvW6PEr-IlIrjwf1Sdg7_vuoLWg",
    description: "Open luxe red lipstick with golden metallic casing against a deep velvety background"
  },
  {
    id: "4",
    slug: "infinite-shine-big-apple-red",
    brand: "OPI",
    name: "Infinite Shine - Big Apple Red",
    title: "Infinite Shine - Big Apple Red",
    price: 950,
    oldPrice: 1200,
    isSale: true,
    category: "nails",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXu5-3wMhRHQcHGGF9k1MUU8BGw2rPfKUmvCL9mp_dhCOgCWuaNBax5XiGGHod0ni82c5taAT0Z-bJ50wfABImyARrp-r_Ysz761r86RBq-clCk-UGRyjSAD8US-UbgwPlnR2casdpoQYhAJApirRhMXlxmAYwrm_2_F230cBEcVRT2ps1-HLVl0hJ9MOFvNRb8O7DDx16cXHdPEzuDAodqsqoB0_8I3Wvj3XGdkZRDb0c6uDFkBkIKpdhMpHYT7jLDJwUNj0i1GZA",
    description: "Glossy pink nail polish bottle with a swirl of liquid polish in the background, high shine finish"
  },
  {
    id: "5",
    slug: "anthelios-uvmune-400",
    brand: "La Roche-Posay",
    name: "Anthelios UVMune 400",
    title: "Anthelios UVMune 400",
    price: 1850,
    isSale: false,
    category: "skincare",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdq5E6q34h4JcdF25_URSIiZBgZjPkP5U0taERbMN6TWxwkfS4pCEmBdIpOCq18LrdiNDv0QFZ9QJfvU6aEZcCeYUwlOl61zuSzZzGRDVeTR_nkYFga5t3ZQpBREf9FjxTfl__wY_gblteKLpwkSic2Lb0Hq5LuBm7zxumIMt9NBQT6SSOt9o8kXu7Qb4S6mdKY2BmO-nciaS_1UVfBFRsfKvLta2cvftex1BiOoGIKz64uAXbSdjQCjgHtap5dn1_BD8CkDwLvA",
    description: "Modern sunscreen tube resting on a beach towel with harsh sunlight shadows, minimalist aesthetic"
  },
  {
    id: "6",
    slug: "elixir-ultime-loriginal",
    brand: "Kérastase",
    name: "Elixir Ultime L'Original",
    title: "Elixir Ultime L'Original",
    price: 4200,
    isSale: false,
    category: "haircare",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeGq7w5WaiWZ4lL29bSCsHhQpvGt0bjprNzO-YhMh8qtjQn4njbibnGkn4opxldpNHnmVqihrBos6UQhY96iACNar_jzn-t7_GbsYk7nfq81x8bcbyMMqQ0kFNKgpVNhH3EsRYUtJ3mZPzwL11jdlk-7XclD1fXoYlsTXJCN9Enyp8uPSOZtN9k32ZDUVKaavGQ6jhi2gQMKREA14w7H3MqZ8zvp6F4c5JkwhX42zwOUOAmCxmkaaw0J2Enfu5Tz1aqgUrr63EXw",
    description: "Luxurious golden hair oil in glass bottle with botanical leaves in the background, soft warm lighting"
  },
  {
    id: "7",
    slug: "empowered-palette",
    brand: "Huda Beauty",
    name: "Empowered Palette",
    title: "Empowered Palette",
    price: 4500,
    oldPrice: 5900,
    isSale: true,
    category: "makeup",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3qi_IGxWjsFp2EknNv2N93GX8GPD28qmENcDCIVvNwRQRwII1bhrCxcm5h8BUGISLL2kgBMoBzXeHckiALF153oMJ7pijP9_IR36d6HTW4dX1Hhhb4CS0Hx1_qMHojdhg3auXwveo6RiCzIUXOud2aC7puAxwEB9Bnkd5sq-x6gJzOZq_MbJxYwXauYtkqIJZdkhPnylB3BCC2hWO7AzsApnYEAsuqd4GYtmwxA7PeLQGzEtO2EWbT1anVYCnmH_AY-wcuwR25w",
    description: "Open eyeshadow palette with vibrant shimmer shades, macro photography of powder texture"
  },
  {
    id: "8",
    slug: "hydrating-facial-cleanser",
    brand: "CeraVe",
    name: "Hydrating Facial Cleanser",
    title: "Hydrating Facial Cleanser",
    price: 1250,
    isSale: false,
    category: "skincare",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk1ZBrCZeSW788G8ubX94uqqGuwE6h7Hn0qBZK2fB9Rl1FMFDkrvLOm3K3jaT5RpBmxBfoK09__KDkHveqXcWzVJxoAib2QuIzUU1FaJD4znxu_9qCVz6WLcID_otScmxuvjCIml8rytppBvHfyEb1kqJ6tydUvVV3Zoe69Rq6jFVYeWl7VYcJlarBF81K28CmbjVC8CcDMjqzxWXcJxBICwTuG6qyrU47v3cQdLCXTmXZD92OPKUDTy4I5leeer2-jFuYnG9U_w",
    description: "Blue tube of hydrating facial cleanser with water splashes, fresh and clean studio photography"
  }
];
