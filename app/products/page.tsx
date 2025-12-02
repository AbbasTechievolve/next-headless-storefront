import Image from "next/image";
export default function Home() {
 return (
 <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
	<div>{process.env.SHOPIFY_API_URL} - {process.env.SHOPIFY_ACCESS_TOKEN}</div>
 </div>
  );
}


