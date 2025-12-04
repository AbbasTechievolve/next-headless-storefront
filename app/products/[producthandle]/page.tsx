export default async function Page({
  params,
}: {
  params: Promise<{ producthandle: string }>
}) {

  const { producthandle } = await params;
  return (
    <div>
      <h1>Product Page</h1>
      <p>Product producthandle: {producthandle}</p>
    </div>
  );
}
