import React, { useEffect, useState } from 'react';
import {Panel} from './Panel';
import {GuitarMesh} from './Guitar';
import Cube from './Cube';

export const App = () => {

  const [theColors, setColors] = useState({});
  useEffect((data) => {
    console.log(data)
  }, []);

  // const setColors = (colors) => {
  //   theColors = {current: colors.current, items: colors.items};
  // };

  return (
    <div className="grid">
      {/* <Cube /> */}
      <Panel data={theColors}/>
      <GuitarMesh setColors={setColors}/>
    </div>
  )
}