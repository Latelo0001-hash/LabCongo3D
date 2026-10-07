import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export default function StudioLighting() {
  const getState = useThree((state) => state.get);
  useEffect(() => {
    const { gl, scene, invalidate } = getState();
    // Reflets calculés localement : aucune image HDR externe ni requête tierce.
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, .025);
    const previous = scene.environment;
    scene.environment = environment.texture;
    room.dispose();
    generator.dispose();
    invalidate();
    return () => {
      scene.environment = previous;
      environment.dispose();
    };
  }, [getState]);
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
