import Group from '@/app/components/Group';

const Sheets = () => {
  const arr = ["a", "b", "c"];

  return (
    <div>
      <h1 className="text-2xl">Sheets</h1>
      {arr.map((item, index) => (
        <Group key={index} group={item} />
      ))}
    </div>
  );
}

export default Sheets;