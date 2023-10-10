export const authorize = async (shop: string) => {
  return encodeURI(`https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${process.env.SHOPIFY_CLIENT_ID}&scope=${process.env.SHOPIFY_SCOPES}&redirect_uri=${process.env.SHOPIFY_REDIRECT_URI}`)
}

export const redirect = async (code: string, shop: string) => {
  let shopifyOauthUri = `https://${shop}/admin/oauth/access_token?client_id=${process.env.SHOPIFY_CLIENT_ID}&client_secret=${process.env.SHOPIFY_CLIENT_SECRET}&code=${code}`
  // Shouldn't use then/catch
  const request = await fetch(shopifyOauthUri, {
    method: "POST",
    body: null
  })
    .then((response) => {
      return response.json()
    })
    .catch((error) => {
      return error
    })

  return { data: { ...request, shop } || "Error" };
}

const baseUrl = (shop: string) => `https://${shop}/admin/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/`

export const getProducts = async (shop: string, accessToken: string = "") => {
  // Shouldn't use then/catch
  const request = await fetch(`${baseUrl(shop)}products.json`, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": accessToken
    }
  }).then((response) => {
    return response.json()
  })
    .catch((error) => {
      return error
    })

  return { data: request || "Error" };
}
