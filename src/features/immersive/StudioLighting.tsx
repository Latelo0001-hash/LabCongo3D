import { useRoomEnvironment } from './useRoomEnvironment';

export default function StudioLighting() {
  useRoomEnvironment();
  return <>
    <ambientLight intensity={.18} />
    <hemisphereLight args={['#e5eff9', '#45423c', .5]} />
    <directionalLight position={[-3, 6, 5]} intensity={1.8} color="#fff6e7" castShadow
      shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7}
      shadow-camera-top={7} shadow-camera-bottom={-7} shadow-camera-near={.1} shadow-camera-far={25}
      shadow-bias={-.00015} shadow-normalBias={.018} shadow-radius={3} />
    <directionalLight position={[4, 2, -3]} intensity={1.1} color="#b9d3ef" />
  </>;
}
