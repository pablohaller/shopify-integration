"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<unknown[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shop = searchParams.get("shop");
    const accessToken = searchParams.get("access_token");

    if (shop && accessToken) {
      setHasToken(true);
    }
  }, [searchParams]);

  const handleGetData = useCallback(async () => {
    const shop = searchParams.get("shop");
    const accessToken = searchParams.get("access_token");
    if (hasToken && shop && accessToken) {
      const queryParams = new URLSearchParams({ shop, accessToken }).toString();
      const request = await fetch(`/api/shopify/products?${queryParams}`);
      const { data } = await request.json();
      setProducts(data?.products);
      setLoading(false);
    }
  }, [hasToken, searchParams]);

  return (
    <div className="p-2">
      <div>Test URL: https://capcom-dev.myshopify.com</div>
      <div>Test URL: https://platinum-dev.myshopify.com</div>
      {hasToken && <div className="text-red-500 text-xl">Has token!</div>}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const { hostname } = new URL(formData.get("shop") as string);
          const shop = hostname.split(".")[0];
          router.push(
            `${process.env.NEXT_PUBLIC_API_URI}/api/shopify/authorize?shop=${shop}`
          );
        }}
        className="flex flex-col gap-2 mt-10"
      >
        <div className="flex gap-2 items-center">
          <label>Shop:</label>
          <input
            name="shop"
            placeholder="Shop"
            className="bg-black border border-white-2 p-1 w-full rounded-lg"
          />
        </div>
        <button
          className="border-2 p-2 hover:border-gray-500 rounded-lg"
          type="submit"
        >
          Submit
        </button>
      </form>
      {hasToken && (
        <button
          className="border-2 p-2 mt-2 hover:border-gray-500 rounded-lg w-full"
          onClick={() => {
            setLoading(true);
            handleGetData();
          }}
        >
          Get Data
        </button>
      )}
      {loading && !!products.length ? (
        <div>Loading...</div>
      ) : (
        products?.map((product: any) => (
          <div
            key={product?.id}
            className="border border-2-white my-2 rounded-md flex gap-2"
          >
            <Image
              src={product?.image?.src || "https://placehold.co/200x200.png"}
              alt={product?.title}
              width={200}
              height={200}
            />
            <div className="flex flex-col justify-between w-full">
              <div>
                <div className="text-xl font-bold">{product?.title}</div>
                <div className="text-xs italic">{product?.tags}</div>
              </div>
              <div className="text-2xl text-right m-2">
                ${product?.variants?.[0]?.price}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
