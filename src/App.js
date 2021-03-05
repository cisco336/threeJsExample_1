import React from 'react';
import {Panel} from './Panel';
import Guitar from './Guitar';
import Cube from './Cube';

export default function App() {
  const getColors = (colors) => {
    alert(colors);
  };
  return (
    <div className="grid">
      <Cube />
      <Panel />
      <Guitar getColors/>
    </div>
  )
}