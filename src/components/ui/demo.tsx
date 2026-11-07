import { ProductShelf } from "@/components/ui/skincare-product-shelf";

export default function ProductShelfDemo() {
  return (
    <ProductShelf>
      <p className="fixed right-5 bottom-4 z-40 m-0 text-[12px] text-[#6e6e73]">
        by{" "}
        <a
          href="https://aakashmehra.com/ref/productshelf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1d1d1f] underline-offset-4 hover:underline"
        >
          aakashmehra.com
        </a>
      </p>
    </ProductShelf>
  );
}

