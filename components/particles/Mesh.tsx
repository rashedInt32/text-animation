export default function Mesh({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[20, 10, 10]} />
      <meshStandardMaterial color="#314158" side={1} />
    </mesh>
  );
}
