import { useState } from 'react';

export const useDrag = () => {
  const [pos, setPos] = useState({x: 0, y: 0});
  const [initPos, setInitPos] = useState({x: 0, y: 0});
  const [accPos, setAccPos] = useState({x: 0, y: 0});
  const [dragging, setDragging] = useState(0);
  const onDragStart = (event: any) => {
    setDragging(1);
    setInitPos({x: event.clientX, y: event.clientY});
  };

  const onDrag = (event: any) => {
    if (dragging) {
      setPos({x: event.clientX + accPos.x - initPos.x, y: event.clientY + accPos.y - initPos.y});
    }
  };

  const onDragEnd = () => {
    setDragging(0);
    setAccPos({...pos});
  };

  const center = (x: number, y: number) => {
    setPos({x, y});
    setAccPos({x, y});
  }

  return {
    pos, dragging, onDragStart, onDrag, onDragEnd, center
  }
};