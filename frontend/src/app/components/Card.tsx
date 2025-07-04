import { useRouter, usePathname } from "next/navigation";

interface CardInterface {
  id: string,
  name: string,
  color: string,
}

const Card = ({ item, type }: { item: CardInterface; type: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const id = item.id;
  const color = item.color;

  const handleClick = () => {
    if (type === "groups") {
      router.push(`/${type}/${id}`);
    }
    else {
      router.push(`${pathname}/${type}/${id}`);
    }
  }
  return (
    <div
      onClick={handleClick}
      className="container max-w-screen-xl px-4"
      style={{ backgroundColor: color }}
    >
      <h1 className="text-xl font-bold mb-4">Card Component</h1>
      <p>{item.name}</p>
    </div>
  );
}

export default Card;