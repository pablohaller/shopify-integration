'use server'

import { redirect } from "@/utils/shopify"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const shop = searchParams.get('shop')

  const { data: shopifyInfo } = await redirect(code!, shop!)
  const queryParams = new URLSearchParams(shopifyInfo).toString();

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URI}?${queryParams}`)
}