import { authorize } from "@/utils/shopify"
import { NextResponse } from "next/server"

export async function GET(request: any) {
  const searchParams = request.nextUrl.searchParams
  const shop = searchParams.get('shop')

  return NextResponse.redirect(await authorize(shop))
}