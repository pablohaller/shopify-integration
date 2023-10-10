import { getProducts } from "@/utils/shopify"
import { NextResponse } from "next/server"

export async function GET(request: any) {
  const searchParams = request.nextUrl.searchParams
  const shop = searchParams.get('shop')
  const accessToken = searchParams.get('accessToken')
  const req = await getProducts(shop, accessToken);

  return NextResponse.json(req)
}