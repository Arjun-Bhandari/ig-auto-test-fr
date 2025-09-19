import Image from "next/image";

export const IgConnectButton = () => {
  const CLIENTID = process.env.NEXT_PUBLIC_IG_CLIENT_ID;
  const FRONTENDURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
console.log(`Redirect URI:${FRONTENDURL}/auth/instagrm/callback`)
  const scopes = [
    "instagram_business_basic",
    "instagram_business_manage_messages",
    "instagram_business_manage_comments",
    "instagram_business_content_publish",
  ].join("%20"); // space-separated (URL-encoded)

  const igAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${CLIENTID}&redirect_uri=${FRONTENDURL}/auth/instagram/callback&response_type=code&scope=${scopes}`;

  return (
    <button className="bg-blue-700 rounded-4xl w-full mx-auto max-w-2xl px-2 py-2 hover:bg-blue-500">
      <a href={igAuthUrl} className="relative flex justify-center items-center">
        <Image src="/ig-logo.svg" alt="ig-logo" width={24} height={24} className="mr-2" />
        Connect Instagram
      </a>
    </button>
  );
};
