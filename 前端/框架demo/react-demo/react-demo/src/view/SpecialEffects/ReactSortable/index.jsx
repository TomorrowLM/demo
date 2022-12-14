import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import Gif from "./Gif";
import React, { useState } from "react";

export default function ReactSortable(params) {
  const SortableGifsContainer = SortableContainer(({ children }) => (
    <div
      className="gifs"
      style={{ display: "flex", justifyContent: "space-around" }}
    >
      {children}
    </div>
  ));
  //   let a = [1,2]
  //   a = arrayMoveImmutable(a,0,1)
  //   console.log(a)
  const SortableGif = SortableElement(({ gif }) => <Gif key={gif} gif={gif} />);
  const [gifs, setGifs] = useState([1, 2, 3]);
  const onSortEnd = ({ oldIndex, newIndex }) => {
    console.log(oldIndex, arrayMoveImmutable(gifs, oldIndex - 1, newIndex - 1));
    setGifs(arrayMoveImmutable(gifs, oldIndex, newIndex));
  };
  return (
    <div>
      <SortableGifsContainer
        axis="x"
        onSortEnd={onSortEnd}
        disableAutoscroll={true}
        useDragHandle //使用SortableHandle
      >
        {gifs.map((gif, i) => {
          return (
            <SortableGif
              // don't forget to pass index prop with item index
              index={i}
              key={i}
              gif={gif}
            />
          );
        })}
      </SortableGifsContainer>
    </div>
  );
}
