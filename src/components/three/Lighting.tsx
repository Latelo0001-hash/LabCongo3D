export default function Lighting() {
  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 5, 4]} intensity={3} />
      <directionalLight position={[-3, 2, -2]} intensity={2} color="#c8deff" />
    </>
  );
}
