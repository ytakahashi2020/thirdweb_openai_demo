import { NextResponse } from "next/server";
import { NFT_CONTRACT_ADDRESS } from "../../../../constants/constants";
import https from "https";
import fetch from "node-fetch";

const { ENGINE_URL, THIRDWEB_SECRET_KEY, BACKEND_WALLET_ADDRESS } = process.env;

export async function POST(req: Request) {
  if (!ENGINE_URL || !THIRDWEB_SECRET_KEY || !BACKEND_WALLET_ADDRESS) {
    throw new Error("Missing environment variables");
  }

  const { userImage, address } = await req.json();
  console.log("userImage", userImage);
  console.log("address", address);

  console.log(
    `${ENGINE_URL}/contract/mumbai/${NFT_CONTRACT_ADDRESS}/erc721/mint-to`
  );

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  const res = await fetch(
    `${ENGINE_URL}/contract/mumbai/${NFT_CONTRACT_ADDRESS}/erc721/mint-to`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
        "x-backend-wallet-address": BACKEND_WALLET_ADDRESS,
      },
      agent: agent,
      body: JSON.stringify({
        receiver: address,
        metadata: {
          name: "AI NFT",
          description: "NFT generated by AI",
          image: userImage,
        },
      }),
    }
  );
  if (res.ok) {
    console.log("Minted NFT", await res.json());
  } else {
    console.log("Failed to mint NFT", await res.text());
  }

  return NextResponse.json({ message: "Minted NFT Successfully!" });
}
