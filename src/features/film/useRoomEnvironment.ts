import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Reflets calculés localement : aucune image HDR externe ni requête tierce.
export function useRoomEnvironment() {
  const getState = useThree((state) => state.get);
  useEffect(() => {
    const { gl, scene, invalidate } = getState();
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
}
