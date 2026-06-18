import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { Container } from "@/components/common/Container";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RelatedProducts } from "@/components/product/RelatedProducts";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  return (
    <Container>
      <div className="grid gap-6 py-8">
        <ProductGallery />
        <ProductDetails product={product} />
        <RelatedProducts />
      </div>
    </Container>
  );
}